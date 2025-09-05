import imagekit from "@/lib/imagekit";

export interface ImageUploadResult {
  url: string;
  fileId: string;
  name: string;
  [key: string]: any;
}

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

export class ImageService {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  static validateImageFile(file: File): ImageValidationResult {
    if (!file.type || !this.ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: "Please upload a valid image file (JPEG, PNG, or WebP)"
      };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: "File size must be less than 10MB"
      };
    }

    return { isValid: true };
  }

  static async uploadImage(file: File, prefix: string = 'image', skipValidation: boolean = false): Promise<ImageUploadResult> {
    try {
      if (!skipValidation) {
        const validation = this.validateImageFile(file);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }
      }

      const base64File = Buffer.from(await file.arrayBuffer()).toString("base64");
      
      const upload = await imagekit.upload({
        file: base64File,
        fileName: `${prefix}-${Date.now()}.${this.getFileExtension(file.type)}`,
        isPublished: true,
      });

      return upload as ImageUploadResult;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async uploadBase64Image(base64Data: string, prefix: string = 'generated'): Promise<ImageUploadResult> {
    try {
      const upload = await imagekit.upload({
        file: `data:image/png;base64,${base64Data}`,
        fileName: `${prefix}-${Date.now()}.png`,
        isPublished: true,
      });

      return upload as ImageUploadResult;
    } catch (error) {
      throw new Error(`Failed to upload base64 image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static getFileExtension(mimeType: string): string {
    const extensions: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp'
    };
    return extensions[mimeType] || 'jpg';
  }

  static resolutionToAspect(resolution: string): string {
    const aspectMap: Record<string, string> = {
      "1024x1024": "1:1",
      "1536x1024": "3:2",
      "1024x1536": "2:3"
    };
    
    if (!aspectMap[resolution]) {
      throw new Error(`Unsupported resolution: ${resolution}`);
    }
    
    return aspectMap[resolution];
  }

  static validateResolution(resolution: string): boolean {
    return ["1024x1024", "1536x1024", "1024x1536"].includes(resolution);
  }
}