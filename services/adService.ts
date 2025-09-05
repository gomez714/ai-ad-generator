import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";

export interface CreateAdData {
  userEmail: string;
  description: string;
  resolution: string;
}

export interface UpdateAdData {
  productImageUrl?: string;
  finalProductImageUrl?: string;
  status?: 'pending' | 'completed' | 'failed';
  aspect?: string;
  seed?: number;
  prompts?: {
    textToImage: string;
    imageToVideo: string;
  };
}

export interface AdDocument {
  id: string;
  userEmail: string;
  description: string;
  resolution: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  productImageUrl?: string;
  finalProductImageUrl?: string;
  aspect?: string;
  seed?: number;
  prompts?: {
    textToImage: string;
    imageToVideo: string;
  };
}

export class AdService {
  static async createAd(adData: CreateAdData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "users-ads"), {
        ...adData,
        status: "pending",
        createdAt: new Date(),
      });
      
      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to create ad: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async updateAd(adId: string, updateData: UpdateAdData): Promise<void> {
    try {
      const adDocRef = doc(db, "users-ads", adId);
      await updateDoc(adDocRef, updateData);
    } catch (error) {
      throw new Error(`Failed to update ad: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async markAdCompleted(
    adId: string,
    productImageUrl: string,
    finalProductImageUrl: string,
    aspect: string,
    seed: number,
    prompts: { textToImage: string; imageToVideo: string }
  ): Promise<void> {
    await this.updateAd(adId, {
      productImageUrl,
      finalProductImageUrl,
      status: "completed",
      aspect,
      seed,
      prompts,
    });
  }

  static async markAdFailed(adId: string, error?: string): Promise<void> {
    const updateData: UpdateAdData = {
      status: "failed",
    };

    await this.updateAd(adId, updateData);
  }
}