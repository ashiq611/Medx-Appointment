"use client";

import { withAuth } from "@/hoc/withAuth";
import { motion } from "framer-motion";

 function DashboardPage() {
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
