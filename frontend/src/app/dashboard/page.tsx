"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { withAuth } from "@/hoc/withAuth";
import { useAuthStore } from "@/store/useStore";


function DashboardPage() {
  const router = useRouter();
  const { user,checkAuth, logout} = useAuthStore((state) => (state))

  useEffect(() => {
    checkAuth(); // Check authentication status on mount
  }, []);
  
  console.log("🚀 ~ file: page.tsx:8 ~ DashboardPage ~ user:", user)

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  

 

  return (
    <div className="p-8">
      <h1 className="text-2xl">Welcome, {user?.name}</h1>
      {/* Secure dashboard content */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default withAuth(DashboardPage);
