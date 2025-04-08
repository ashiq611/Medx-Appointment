"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/services/store";

export default function HomePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard"); // Redirect logged-in users
    } else {
      router.push("/login");     // Or send them to login
    }
  }, [user]);

  return <p>Redirecting...</p>;
}
