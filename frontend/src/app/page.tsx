"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/store/useStore";


export default function HomePage() {
// const { user } = useAuthStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    // redirect to /home
    router.push("/home");
  }, [router]);

  // useEffect(() => {
  //   if (user) {
  //     router.push("/dashboard"); // Redirect logged-in users
  //   } else {
  //     router.push("/login");     // Or send them to login
  //   }
  // }, [user]);

  return <p>Redirecting...</p>;
}
