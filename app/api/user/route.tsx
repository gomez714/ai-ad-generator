
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/configs/firebaseConfig";
import { collection, query, where, getDocs, addDoc, doc } from "firebase/firestore";

export async function POST(req: NextRequest) {
    const { userEmail, userName } = await req.json();

    try {
        // Check if user already exists
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", userEmail));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // User doesn't exist, create new user
            const newUser = {
                name: userName,
                email: userEmail,
                credits: 0,
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(usersRef, newUser);
            
            return NextResponse.json({
                id: docRef.id,
                ...newUser
            });
        } else {
            // User exists, return existing user data
            const existingUser = querySnapshot.docs[0];
            return NextResponse.json({
                id: existingUser.id,
                ...existingUser.data()
            });
        }

    } catch (error) {
        console.error("Error in user API:", error);
        return NextResponse.json(
            { error: "Internal server error" }, 
            { status: 500 }
        );
    }
}