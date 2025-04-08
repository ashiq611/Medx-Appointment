"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/services/store";


export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  if (!user) return <p>Checking authentication...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl">Welcome, {user.id}</h1>
      {/* Secure dashboard content */}
    </div>
  );
}
