"use client";
import Image from "next/image";
import Link from "next/link";
import Authentication from "./_components/Authentication";
import { Button } from "@/components/ui/button";
import { auth } from "@/configs/firebaseConfig";
import ProfileAvatar from "./_components/ProfileAvatar";
import { useAuthContext } from "./provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const user = useAuthContext();

  useEffect(() => {
    router.replace("/dashboard");
  }, []);
  return <div></div>;
}
