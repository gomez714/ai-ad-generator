"use client";
import { ImagePlus, Loader2, Monitor, Smartphone, Sparkles, Square } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { SampleProducts } from "@/constants/SampleProducts";
import { StaticImageData } from "next/image";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FormInputProps {
  onHandleInputChange: any;
  onGenerate: any;
  loading: boolean;
}

function FormInput({onHandleInputChange, onGenerate, loading}: FormInputProps) {
  const [preview, setPreview] = useState<string | StaticImageData | null>(null);

  const onFileSelect = (files: FileList | null) => {
    if (!files || files?.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert("File size is greater than 5MB");
      return;
    }
    onHandleInputChange('file', file );
    setPreview(URL.createObjectURL(file));
  };

  const convertImageToFile = async (staticImage: StaticImageData, filename: string): Promise<File> => {
    const response = await fetch(staticImage.src);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };
  return (
    <div>
      <div>
        <h2 className="font-semibold">1. Upload Product Image</h2>
        <div>
          <label
            htmlFor="imageUpload"
            className="mt-2 border-dashed border-2 rounded-xl flex flex-col p-4 items-center cursor-pointer justify-center min-h-[200px]"
          >
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                width={300}
                height={300}
                className="w-full h-full max-h-[200px] object-contain rounded-xl"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 ">
                <ImagePlus className="h-8 w-8 opacity-45" />

                <h2 className="text-xl">Click here to upload image</h2>
                <p className="opacity-45">Upload image up to 5MB</p>
              </div>
            )}
          </label>
          <input
            type="file"
            id="imageUpload"
            className="hidden"
            accept="image/*"
            onChange={(event) => onFileSelect(event.target.files)}
          />
        </div>
        <div>
          <h2 className="mt-3 opacity-40 text-center">
            Try one of our sample products
          </h2>
          <div className="flex gap-5 items-center">
            {SampleProducts.map((product, index) => (
              <Image
                src={product.image}
                alt={product.name}
                width={60}
                height={60}
                key={index}
                className="rounded-lg cursor-pointer hover:scale-105 transition-all duration-300"
                onClick={async () => {
                  setPreview(product.image);
                  const file = await convertImageToFile(product.image, `${product.name}.png`);
                  onHandleInputChange('file', file);
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="font-semibold">2. Enter Product Description</h2>
        <Textarea
          placeholder="Tell me more about your and how you want it to be displayed"
          className="min-h-[150px] mt-2"
          onChange={(event) => onHandleInputChange('description', event.target.value)}
        />
      </div>
      <div className="mt-8">
        <h2 className="font-semibold">3. Select image size</h2>
        <Select onValueChange={(value) => onHandleInputChange('resolution', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Resolution" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1024x1024">
              <div className="flex items-center gap-2">
                <Square className="w-4 h-4" />
                <span>1:1</span>
              </div>
            </SelectItem>
            <SelectItem value="1536x1024">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                <span>16:9</span>
              </div>
            </SelectItem>
            <SelectItem value="1024x1536">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span>9:16</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className="w-full mt-5" onClick={onGenerate} disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles />}
        Generate
      </Button>
      <h2 className="mt-1 text-sm opacity-35 text-center">5 Credits to Generate</h2>
    </div>
  );
}

export default FormInput;
