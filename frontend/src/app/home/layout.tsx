"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/store/services/api/authApi";
import { UserloggedOut } from "@/store/services/slices/authSlice";
import { toast } from "react-toastify";
import { RoleNamesEnum } from "../constant/formFeilds";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const handleNavigate = (path: string) => {
    router.push(path);
    setMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result) {
        dispatch(UserloggedOut());
        router.push("/login");
        toast.success("Logout successful");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col relative">
      {/* Top Navbar */}
      <div className="flex justify-between items-center p-4 shadow bg-white relative">
        {/* Left: Menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 bg-blue-600 text-white rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Center: Company Name */}
        <h1 className="text-xl font-bold text-blue-800">
          {process.env.NEXT_PUBLIC_COMPANY_NAME}
        </h1>

        {/* Right: Profile Icon */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="p-2 bg-red-600 text-white rounded-full font-extrabold"
          >
            🚑
          </button>

          <AnimatePresence>
            {profileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-xl p-4 z-50"
              >
                <h3 className="font-bold text-lg text-blue-700 mb-2">👤 Profile</h3>
                <div className="text-sm text-gray-700 space-y-1 mb-4">
                  <p><span className="font-semibold">Name:</span> {user?.name}</p>
                  <p><span className="font-semibold">Phone:</span> {user?.phone_number}</p>
                  <p><span className="font-semibold">Role:</span> {user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">{children}</div>

      {/* Side Menu Modal */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-b from-blue-100 to-blue-300 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-40"
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
                    onClick={() => handleNavigate("/home")}
                    className="w-full bg-red-600 text-white py-2 rounded-xl hover:bg-red-700"
                  >
                    🏠 Home
                  </button>
                </li>
                {user?.role !== RoleNamesEnum.DOCTOR && (
                  <li>
                    <button
                      onClick={() => handleNavigate("/home/branches")}
                      className="w-full bg-yellow-600 text-white py-2 rounded-xl hover:bg-yellow-700"
                    >
                      🏥 Branches
                    </button>
                  </li>
                )}
                {user?.role === RoleNamesEnum.ADMIN && (
                  <li>
                    <button
                      onClick={() => handleNavigate("/home/create/user")}
                      className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
                    >
                      🧑‍⚕️ Add User
                    </button>
                  </li>
                )}
              </ul>
              <ul className="space-y-4 mt-4">
              {user?.role === RoleNamesEnum.ADMIN && (
                  <li>
                    <button
                      onClick={() => handleNavigate("/home/create/properties")}
                      className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
                    >
                      🏠 Management
                    </button>
                  </li>
                )}
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
