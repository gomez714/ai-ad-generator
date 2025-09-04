import imagekit from "@/lib/imagekit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const description = formData.get("description");
    const resolution = formData?.get("resolution");

    const arrayBuffer = await file.arrayBuffer();
    const base64File = Buffer.from(arrayBuffer).toString("base64");

    const imageKitRef = await imagekit.upload({
        file: base64File,
        fileName: Date.now().toString() + ".png",
        isPublished: true,
    })

    console.log(imageKitRef.url);

    return NextResponse.json({
        imageUrl: imageKitRef.url,
    })
}