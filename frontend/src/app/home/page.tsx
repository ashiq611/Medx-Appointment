"use client";

import { motion } from "framer-motion";

export default function DashboardPage() {
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
