"use client";

import { withAuth } from "@/hoc/withAuth";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const doctorPromotions = [
  "Find the Best Doctors in Your City",
  "Top Specialists Ready to Serve You",
  "Get Expert Medical Advice Anytime",
  "Trusted Care for Your Health",
  "Your Health, Our Priority",
];

const gifImages = [
  "https://i.pinimg.com/originals/b8/23/e3/b823e38cc01fdb9278b6f7faa2feda6d.gif",
  "https://www.icegif.com/wp-content/uploads/2023/10/icegif-943.gif",
];

function DashboardPage() {
  const { user } = useSelector((state: any) => state.auth);
  const router = useRouter();
  const [currentPromotion, setCurrentPromotion] = useState(0);
  const [currentGif, setCurrentGif] = useState(0);

  useEffect(() => {
    if (user?.role === "Doctor") {
      router.push(`/home/doctor/hospital/${user?.personalId}`);
    }
  }, [user, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromotion((prev) => (prev + 1) % doctorPromotions.length);
    }, 3000); // Change promotion every 3 seconds
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const gifInterval = setInterval(() => {
      setCurrentGif((prev) => (prev + 1) % gifImages.length);
    }, 10000); // Change gif every 10 seconds
    return () => clearInterval(gifInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)]  bg-gradient-to-b from-blue-100 to-blue-300 p-6">
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to Medx-Appointment
      </motion.h1>

      <motion.div
        key={currentPromotion}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        className="text-xl md:text-2xl text-blue-700 font-semibold text-center"
      >
        {doctorPromotions[currentPromotion]}
      </motion.div>

      <motion.img
        key={gifImages[currentGif]}
        src={gifImages[currentGif]}
        alt="Doctors Team"
        className="w-full max-w-md mt-8 rounded-lg shadow-lg"
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      />
    </div>
  );
}

export default withAuth(DashboardPage);
