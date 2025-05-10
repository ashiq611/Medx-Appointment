"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "@/store/services/api/authApi";
import { UserloggedOut } from "@/store/services/slices/authSlice";
import { toast } from "react-toastify";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const handleNavigate = (path: string) => {
    router.push(path);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result) {
        dispatch(UserloggedOut());
        router.push("/login");
        toast.success("Logout successful")
        console.log("Logout successful", result);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col">
      {/* Top Navbar */}
      <div className="flex justify-between items-center p-4 shadow bg-white">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 bg-blue-600 text-white rounded-full"
        >
          {/* icon with menu */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-blue-800">{process.env.NEXT_PUBLIC_COMPANY_NAME}</h1>
        <button
          onClick={handleLogout}
          className="p-2 bg-red-600 text-white rounded-full font-extrabold"
        >
          {/* attractive icon with ambulance logout */}
           Logout 🚑
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">{children}</div>

      {/* Menu Modal */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-b from-blue-100 to-blue-300 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-2xl shadow-lg p-8 w-[90%] max-w-md"
            >
              <h2 className="text-lg font-bold mb-4 text-center">Menu</h2>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => handleNavigate('/home')}
                    className="w-full bg-red-600 text-white py-2 rounded-xl hover:bg-red-700"
                  >
                    🏠 Home
                    
                  </button>
                </li>
                
                <li>
                  <button
                    onClick={() => handleNavigate('/home/branches')}
                    className="w-full bg-yellow-600 text-white py-2 rounded-xl hover:bg-yellow-700"
                  >
                    🏥 Branches
                  </button>
                </li>

                {/* <li>
                  <button
                    onClick={() => handleNavigate('/home/create/doctor')}
                    className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
                  >
                    👨‍⚕️ Add Doctor
                  </button>
                </li> */}

                <li>
                  <button
                    onClick={() => handleNavigate('/home/create/user')}
                    className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
                  >
                    🧑‍⚕️ Add User
                  </button>
                </li>

                {/* <li>
                  <button
                    onClick={() => handleNavigate('/home/create/branch')}
                    className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700"
                  >
                    🏥 Add Branch
                  </button>
                </li> */}
              </ul>

              <button
                onClick={() => setMenuOpen(false)}
                className="mt-6 w-full bg-gray-300 text-gray-800 py-2 rounded-xl hover:bg-gray-400"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
