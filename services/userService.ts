import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";

export interface UserData {
  id: string;
  email: string;
  credits: number;
  [key: string]: any;
}

export class UserService {
  static async getUserByEmail(email: string): Promise<UserData | null> {
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const userDoc = querySnapshot.docs[0];
      return {
        id: userDoc.id,
        ...userDoc.data()
      } as UserData;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async deductCredits(userId: string, credits: number): Promise<void> {
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        credits: credits - 5
      });
    } catch (error) {
      throw new Error(`Failed to deduct credits: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async validateUserAndCredits(email: string, requiredCredits: number = 5): Promise<UserData> {
    const user = await this.getUserByEmail(email);
    
    if (!user) {
      throw new Error("User not found");
    }
    
    if (user.credits < requiredCredits) {
      throw new Error("Insufficient credits");
    }
    
    return user;
  }
}