"use client";
import React, { useState } from "react";
import FormInput from "../_components/FormInput";
import ResultPreview from "../_components/ResultPreview";
import axios from "axios";
import { useAuthContext } from "@/app/provider";

type FormData = {
  file?: File | undefined;
  description: string;
  resolution: string;
  imageUrl?: string;
};

function ProductImagesPage() {
  const [formData, setFormData] = useState<FormData>({
    file: undefined,
    description: "",
    resolution: "1024x1024",
  });
  const [loading, setLoading] = useState(false);
  const {user} = useAuthContext();
  const onHandleInputChange = (field: string, value: unknown) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };
  const onGenerate = async () => {
    if (!formData?.file && !formData?.imageUrl) {
      alert("Please upload a product image");
      return;
    }
    if (!formData?.description || !formData?.resolution) {
      alert("Please make sure you have filled in all the fields");
      return;
    }
    setLoading(true);


    const formDataToSend = new FormData();
    if (formData.file) {
      formDataToSend.append("file", formData.file);
    }
    formDataToSend.append("description", formData.description);
    formDataToSend.append("resolution", formData.resolution);
    formDataToSend.append("userEmail", user?.email || "");

    const result = await axios.post("/api/generate-product-image", formDataToSend);
    console.log(result.data);


    setLoading(false);
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">AI Proudcts Image Generator</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <FormInput
            onHandleInputChange={(field: string, value: unknown) =>
              onHandleInputChange(field, value)
            }
            onGenerate={onGenerate}
            loading={loading}
          />
        </div>
        <div className="md:col-span-2">
          <ResultPreview />
        </div>
      </div>
    </div>
  );
}

export default ProductImagesPage;
