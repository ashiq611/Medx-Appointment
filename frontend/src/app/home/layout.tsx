"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { useLogoutMutation } from "@/store/services/api/authApi";
import { UserloggedOut } from "@/store/services/slices/authSlice";
import { RoleNamesEnum } from "../constant/formFeilds";
import { li } from "framer-motion/client";
import { FaHome, FaUserMd } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { BsHospitalFill } from "react-icons/bs";

/**
 * Expects `state.auth.user` like:
 * {
 *   id: string;
 *   name: string;
 *   email: string;
 *   role: RoleNamesEnum;
 *   avatarUrl?: string; // optional profile image url
 * }
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const profileBtnRef = useRef<HTMLButtonElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useSelector((state: any) => state.auth);

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleNavigate = (path: string) => {
    router.push(path);
    setMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap?.(); // RTK Query style (noop if not available)
      dispatch(UserloggedOut());
      router.push("/login");
      toast.success("Logout successful");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error?.data?.message || "Failed to log out");
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        profileMenuOpen &&
        profileMenuRef.current &&
        profileBtnRef.current &&
        !profileMenuRef.current.contains(target) &&
        !profileBtnRef.current.contains(target)
      ) {
        setProfileMenuOpen(false);
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [profileMenuOpen]);

  const displayName = user?.name || user?.fullName || "User";
  const email = user?.email || "";
  const avatarUrl =
    user?.avatarUrl || "/next.svg"; // place a default in /public/images

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col relative">
      {/* Top Navbar */}
      <div className="flex justify-between items-center p-4 shadow bg-white relative">
        {/* Left: Menu button */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="p-2 bg-blue-600 text-white rounded-full"
          aria-label="Open menu"
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

        {/* Right: Profile */}
        <div className="relative">
          <button
            ref={profileBtnRef}
            onClick={() => setProfileMenuOpen((v) => !v)}
            className="flex items-center gap-2 text-sm bg-gray-100 rounded-full focus:ring-4 focus:ring-gray-300 px-2 py-1"
            aria-haspopup="menu"
            aria-expanded={profileMenuOpen}
          >
            <Image className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" width={40} height={40} src={avatarUrl} alt="Bordered avatar"/>
          </button>

          <AnimatePresence>
            {profileMenuOpen && (
              <motion.div
                ref={profileMenuRef}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.12 }}
                role="menu"
                aria-label="User menu"
                className="absolute right-0 mt-2 z-50 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="px-4 py-3 text-sm text-gray-900">
                  <div className="font-semibold truncate" title={displayName}>
                    {displayName}
                  </div>
                  {email && (
                    <div className="truncate text-gray-500" title={email}>
                      {email}
                    </div>
                  )}
                </div>
                <div className="h-px bg-gray-100" />
                <ul className="py-1 text-sm text-gray-700" role="none">
                  <li>
                    <Link
                      href="/home/dashboard"
                      onClick={() => setProfileMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/settings/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Settings
                    </Link>
                  </li>
                  {user?.role === RoleNamesEnum.ADMIN && (
                    <li>
                      <Link
                        href="/billing"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Billing
                      </Link>
                    </li>
                  )}
                </ul>
                <div className="h-px bg-gray-100" />
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-60"
                    role="menuitem"
                  >
                    {isLoggingOut ? "Signing out…" : "Sign out"}
                  </button>
                </div>
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
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
                aria-label="Close Menu"
              >
                ✖
              </button>

              <h2 className="text-lg font-bold mb-6 text-center text-teal-800">Menu</h2>

              {/* Grid Menu */}
              <ul className="grid grid-cols-2 gap-4 place-items-center">
                <li>
                  <button
                    onClick={() => handleNavigate("/home")}
                    className="w-32 h-32 bg-red-100 text-red-800 text-xs font-bold p-0.5 rounded-lg dark:bg-gray-700 dark:text-red-400 border border-red-400 hover:bg-red-200 flex flex-col items-center justify-center transition-all duration-300"
                  >
                    <span className="text-2xl"><FaHome /> </span>
                    <span className="mt-2">Home</span>
                  </button>
                </li>

                {user?.role !== RoleNamesEnum.DOCTOR && (
                  <li>
                    <button
                      onClick={() => handleNavigate("/home/branches")}
                      className="w-32 h-32 bg-green-100 text-green-800 text-xs font-bold p-0.5 rounded-lg dark:bg-gray-700 dark:text-green-400 border border-green-400 hover:bg-green-200 flex flex-col items-center justify-center transition-all duration-300"
                    >
                      <span className="text-2xl"><BsHospitalFill /></span>
                      <span className="mt-2">Branches</span>
                    </button>
                  </li>
                )}

                {user?.role === RoleNamesEnum.ADMIN && (
                  <>
                    <li>
                      <button
                        onClick={() => handleNavigate("/home/create/user")}
                        className="w-32 h-32 bg-purple-100 text-purple-800 text-xs font-bold p-0.5 rounded-lg dark:bg-gray-700 dark:text-purple-400 border border-purple-400 hover:bg-purple-200 flex flex-col items-center justify-center transition-all duration-300"
                      >
                        <span className="text-2xl"><FaUserMd /></span>
                        <span className="mt-2">Add User</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavigate("/home/create/properties")}
                        className="w-32 h-32 bg-indigo-100 text-indigo-800 text-xs font-bold  p-0.5 rounded-lg dark:bg-gray-700 dark:text-indigo-400 border border-indigo-400 hover:bg-indigo-200 flex flex-col items-center justify-center transition-all duration-300"
                      >
                        <span className="text-2xl"><MdManageAccounts /></span>
                        <span className="mt-2">Management</span>
                      </button>
                    </li>
                  </>
                )}
                {
                  user.role === RoleNamesEnum.PATIENT && (
                    <li>
                      <button
                        onClick={() => handleNavigate("/home/patient")}
                        className="w-32 h-32 bg-yellow-100 text-yellow-800 text-xs font-bold me-2 p-0.5 rounded-lg dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300 flex flex-col items-center justify-center transition-all duration-300"
                      >
                        <span className="text-2xl">🏠</span>
                        <span className="mt-2">Booked Appointment</span>
                      </button>
                    </li>
                    
                  )
                }
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
