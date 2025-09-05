// /api/generate-product-image
import client from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";
import { PROMPT_FOR_PRODUCT_IMAGE } from "@/constants/Prompts";
import { UserService } from "@/services/userService";
import { ImageService } from "@/services/imageService";
import { AdService } from "@/services/adService";
import {
  GenerateProductImageSchema,
  sanitizeFormData,
  ErrorResponse,
} from "@/lib/validation";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  let adId: string | null = null;

  try {
    // Parse and sanitize form data
    const formData = await req.formData();
    const sanitizedData = sanitizeFormData(formData);

    // Validate input using Zod schema
    const validatedInput = GenerateProductImageSchema.parse(sanitizedData);
    const { file, description, resolution, userEmail } = validatedInput;

    const aspect = ImageService.resolutionToAspect(resolution);

    // Validate user and credits
    const user = await UserService.validateUserAndCredits(userEmail, 5);

    // Create ad record
    adId = await AdService.createAd({
      userEmail,
      description,
      resolution,
    });

    // Upload original image (validation already done by Zod)
    const originalUpload = await ImageService.uploadImage(
      file,
      "original",
      true
    );

    // === 1) Get structured prompts (STRICT JSON) ===
    const seed = Math.floor(Math.random() * 1e9);

    const promptResp = await client.chat.completions.create({
      model: "gpt-4.1-mini", // Use correct model name
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "Prompts",
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["textToImage", "imageToVideo"],
            properties: {
              textToImage: { type: "string", minLength: 20, maxLength: 800 },
              imageToVideo: { type: "string", minLength: 20, maxLength: 600 },
            },
          },
        },
      },
      messages: [
        { role: "system", content: PROMPT_FOR_PRODUCT_IMAGE },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `DESCRIPTION:
${description}

RESOLUTION:
${resolution}

ASPECT:
${aspect}

SEED_SUGGESTION:
${seed}`,
            },
            {
              type: "image_url",
              image_url: { url: originalUpload.url, detail: "auto" },
            },
          ],
        },
      ],
    });

    if (!promptResp.choices[0]?.message?.content) {
      throw new Error("No JSON from prompt authoring");
    }
    const { textToImage, imageToVideo } = JSON.parse(
      promptResp.choices[0]?.message?.content
    );

    // === 2) Generate image from the textToImage prompt + uploaded image ===
    const imageResp = await client.responses.create({
      model: "gpt-4.1-mini",
      max_output_tokens: 600,
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: textToImage },
            {
              type: "input_image",
              image_url: originalUpload.url,
              detail: "auto",
            },
          ],
        },
      ],
      tools: [{ type: "image_generation" }],
    });

    const imageB64 = imageResp.output
      ?.filter((x: any) => x.type === "image_generation_call")
      .map((x: any) => x.result)?.[0];

    if (!imageB64) throw new Error("Image generation failed");

    const finalUpload = await ImageService.uploadBase64Image(
      imageB64,
      "generated"
    );

    // Save completion data
    await AdService.markAdCompleted(
      adId,
      originalUpload.url,
      finalUpload.url,
      aspect,
      seed,
      { textToImage, imageToVideo }
    );

    // Deduct credits
    await UserService.deductCredits(user.id, user.credits);

    return NextResponse.json({
      success: true,
      imageUrl: finalUpload.url,
      originalImageUrl: originalUpload.url,
      prompts: { textToImage, imageToVideo },
      meta: { resolution, aspect, seed },
      id: adId,
    });
  } catch (error: any) {
    console.error("Error in generate-product-image:", error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const validationErrors = error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );

      return NextResponse.json(
        {
          error: "Validation failed",
          message: "Invalid input data",
          details: validationErrors,
        } satisfies ErrorResponse,
        { status: 400 }
      );
    }

    // Handle specific known errors
    if (error.message?.includes("User not found")) {
      return NextResponse.json(
        {
          error: "User not found",
          message: "Please make sure you are logged in",
        } satisfies ErrorResponse,
        { status: 404 }
      );
    }

    if (error.message?.includes("Insufficient credits")) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          message: "You need at least 5 credits to generate an image",
        } satisfies ErrorResponse,
        { status: 402 }
      );
    }

    if (error.message?.includes("Failed to upload")) {
      return NextResponse.json(
        {
          error: "Upload failed",
          message: "Failed to upload image. Please try again.",
        } satisfies ErrorResponse,
        { status: 500 }
      );
    }

    // Mark ad as failed if it was created
    if (adId) {
      try {
        await AdService.markAdFailed(adId);
      } catch (updateError) {
        console.error("Failed to mark ad as failed:", updateError);
      }
    }

    // Generic error response
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error?.message ?? "An unexpected error occurred. Please try again.",
      } satisfies ErrorResponse,
      { status: 500 }
    );
  }
}
