"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { withAuth } from "@/hoc/withAuth";
import { useLoginMutation, useLogoutMutation } from "@/store/services/api/authApi";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { UserloggedOut } from "@/store/services/slices/authSlice";
// import { useAuthStore } from "@/store/useStore";


function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [logout, {data, isSuccess, isLoading}] = useLogoutMutation();

  const handleNavigate = (path: string) => {
    router.push(path);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout().then((result: any) => {
      if(result){
        dispatch(UserloggedOut())
        
        router.push("/login");
        console.log("Logout successful", result);
      }
    }
    ).catch((error: any) => {
      console.error("Logout error:", error);
    }
    );
  };

  

 

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center relative">
    {/* Floating Nav Icon */}
    <button
      onClick={() => setMenuOpen(!menuOpen)}
      className="fixed top-6 left-6 p-3 bg-white rounded-full shadow-md z-50"
    >
      {/* <Menu className="w-6 h-6" /> */}
      jddsds
    </button>

    {/* Logout Button */}
    <button
      onClick={handleLogout}
      className="fixed top-6 right-6 p-3 bg-red-600 text-white rounded-full shadow-md z-50"
    >
      {/* <LogOut className="w-6 h-6" /> */}
      Logout
    </button>

    {/* Popup Modal */}
    {menuOpen && (
      <div className="fixed inset-0 bg-white bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="bg-white rounded-2xl shadow-lg p-8 w-[90%] max-w-md text-center relative"
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          >
            {/* <X className="w-5 h-5" /> */}
            ggg
          </button>
          <h2 className="text-xl font-semibold mb-6">Medical Dashboard</h2>
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => handleNavigate('/doctors')}
                className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
              >
                🩺 Doctor List
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate('/appointments')}
                className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
              >
                📅 Appointment
              </button>
            </li>
          </ul>
        </motion.div>
      </div>
    )}

    <h1 className="text-3xl font-bold text-blue-800">Welcome to Medx-Appointment</h1>
  </div>
  );
}

export default withAuth(DashboardPage);
