import { z } from "zod";

// Supported resolutions
const SUPPORTED_RESOLUTIONS = ["1024x1024", "1536x1024", "1024x1536"] as const;

// File validation schema
export const FileValidationSchema = z.object({
  name: z.string().min(1, "File name is required"),
  size: z.number().max(10 * 1024 * 1024, "File size must be less than 10MB"),
  type: z.string().refine(
    (type) => type.startsWith("image/"), 
    "File must be an image"
  ).refine(
    (type) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(type),
    "File must be JPEG, PNG, or WebP"
  ),
});

// Form data validation schema
export const GenerateProductImageSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => FileValidationSchema.safeParse(file).success,
    "Invalid file"
  ),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .refine(
      (desc) => desc.trim().length > 0,
      "Description cannot be empty or whitespace only"
    ),
  resolution: z.enum(SUPPORTED_RESOLUTIONS, {
    errorMap: () => ({ message: `Resolution must be one of: ${SUPPORTED_RESOLUTIONS.join(", ")}` })
  }),
  userEmail: z.string()
    .email("Invalid email address")
    .min(1, "User email is required"),
});

// Response validation schema
export const GenerateProductImageResponseSchema = z.object({
  success: z.boolean(),
  imageUrl: z.string().url("Invalid image URL"),
  originalImageUrl: z.string().url("Invalid original image URL"),
  prompts: z.object({
    textToImage: z.string().min(20, "Text to image prompt too short"),
    imageToVideo: z.string().min(20, "Image to video prompt too short"),
  }),
  meta: z.object({
    resolution: z.enum(SUPPORTED_RESOLUTIONS),
    aspect: z.string().regex(/^\d+:\d+$/, "Invalid aspect ratio format"),
    seed: z.number().int().positive("Seed must be a positive integer"),
  }),
  id: z.string().min(1, "ID is required"),
});

// Error response schema
export const ErrorResponseSchema = z.object({
  error: z.string().min(1, "Error message is required"),
  message: z.string().optional(),
  details: z.array(z.string()).optional(),
});

// Input sanitization helpers
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>'"&]/g, (match) => {
      const entityMap: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      };
      return entityMap[match] || match;
    });
}

export function sanitizeFormData(formData: FormData) {
  const file = formData.get("file") as File | null;
  const description = sanitizeString(String(formData.get("description") || ""));
  const resolution = String(formData.get("resolution") || "").trim();
  const userEmail = String(formData.get("userEmail") || "").trim().toLowerCase();

  return {
    file,
    description,
    resolution,
    userEmail,
  };
}

// Type exports
export type GenerateProductImageInput = z.infer<typeof GenerateProductImageSchema>;
export type GenerateProductImageResponse = z.infer<typeof GenerateProductImageResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;