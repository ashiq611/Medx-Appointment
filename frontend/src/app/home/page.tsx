"use client";

import { withAuth } from "@/hoc/withAuth";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { useSelector } from "react-redux";

 function DashboardPage() {

  const { user } = useSelector((state: any) => state.auth);
  const router = useRouter();

  useEffect(() => {

    if (user?.role === "Doctor") {
      router.push(`/home/doctor/hospital/${user?.personalId}`);
    }
  }, [user]);
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.h1
        className="text-3xl font-bold text-blue-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Welcome to Medx-Appointment
      </motion.h1>
    </div>
  );
}


export default withAuth(DashboardPage);
