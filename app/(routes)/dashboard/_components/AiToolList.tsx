import React from "react";
import Image from "next/image";
import productImage from "@/public/product-image.png";
import productAvatar from "@/public/product-avatar.png";
import productVideo from "@/public/product-video.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const AiTools = [
  {
    name: "AI Proudcts Image",
    description:
      "Generate high quality, professional images of your products using AI",
    banner: productImage,
    path: "/creative-ai-tools/product-images"
  },
  
  {
    name: "AI Proudcts Video",
    description:
      "Create engaging videos for your products using AI",
    banner: productVideo,
    path: "/"
  },
  {
    name: "AI Proudcts Avatar",
    description:
      "Bring your products to life with AI Avatars",
    banner: productAvatar,
    path: "/"
  },
];

function AiToolList() {
  return (
    <div>
      <h2 className="font-bold text-2xl mb-2">Creative AI Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {AiTools.map((tool) => (
          <div key={tool.name} className="flex items-center justify-between p-7 bg-zinc-800 rounded-lg">
            <div>
              <h2 className="font-bold text-2xl">{tool.name}</h2>
              <p className="opacity-60 mt-2">{tool.description}</p>
              <Button className="mt-4" asChild>
                <Link href={tool.path}>Create Now</Link>
              </Button>
            </div>
            <Image
              src={tool.banner}
              alt={tool.name}
              width={300}
              height={300}
              className="w-[200px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AiToolList;
