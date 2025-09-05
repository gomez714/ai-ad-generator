import React, { useState } from "react";
import { useAuthContext } from "@/app/provider";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

type PreviewProduct = {
  id: string;
  finalProductImageUrl: string;
  productImageUrl: string;
  description: string;
  size: string;
  status: string;
};

function ResultPreview() {
  const { user } = useAuthContext();
  const [productList, setProductList] = useState<PreviewProduct[]>([]);

  React.useEffect(() => {
    if (!user?.email) return; // Guard clause

    const q = query(
      collection(db, "users-ads"),
      where("userEmail", "==", user.email),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const matchedDocs: PreviewProduct[] = [];
      snapshot.forEach((doc) => {
        matchedDocs.push({ id: doc.id, ...doc.data() } as PreviewProduct);
      });
      console.log(matchedDocs);
      setProductList(matchedDocs);
    });

    return () => unsub(); // Cleanup subscription
  }, [user?.email]);

  const onDownload = async (imageUrl: string) => {
    const result = await fetch(imageUrl);
    const blob = await result.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.setAttribute("download", "generated-image.png");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
    
  }

  return (
    <div className="p-5 rounded-2xl border">
      <h2 className="font-bold text-2xl">Generated Results</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productList?.map((product, index) => (
          <div key={index}>
            {product?.status === "completed" ? (
              <div>
                <Image
                  src={product.finalProductImageUrl}
                  alt={product.description}
                  width={500}
                  height={500}
                  className="w-full h-[250px] object-cover rounded-lg"
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={() => onDownload(product.finalProductImageUrl)}>
                      <Download />
                    </Button>
                    <Link href={product.finalProductImageUrl} target="_blank">
                    <Button variant="ghost">View</Button>
                    </Link>
                  </div>
                  <Button>
                    <Sparkles />
                    Animate
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center border rounded-xl h-full max-h-[250px] bg-zinc-600">
                <Loader2 className="w-10 h-10 animate-spin" />
                <h2>Generating...</h2>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultPreview;
