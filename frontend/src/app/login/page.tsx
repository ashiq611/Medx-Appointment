'use client';

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import axiosInstance from "@/api/axios";
import DynamicForm from "@/components/DynamicForm";
import { loginFormFields } from "../constant/formFeilds";
import { RootState } from "@/store/store";
import { resetForm } from "@/store/services/slices/formSlice";
import { useLoginMutation } from "@/store/services/api/authApi";
import { UserloggedIn } from "@/store/services/slices/authSlice";

export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { auth } = useSelector((state: RootState) => state);
  const formData = useSelector((state: RootState) => state.form);

  const [error, setError] = useState("");
  const [login, { data, isSuccess, isLoading }] = useLoginMutation();
  const shouldSkip = !formData.phoneNumber || !formData.password;

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push("/home");
    }
  }, [auth.isAuthenticated, router]);

  const handleSubmit = async () => {
    try {
      const { phoneNumber, password } = formData;

      if (shouldSkip) {
        setError("Phone number and password are required.");
        return;
      }

      const result = await login({ phone_number: phoneNumber, password });
      console.log("Login result:", data);

      if ('data' in result) {
        dispatch(UserloggedIn({
          user: {
            id: result.data.data.id,
            role: result.data.data.role,
            is_mfa_active: result.data.data.is_mfa_active,
            name: result.data.name,
            phone_number: result.data.data.phone_number,
            personalId: result.data.data.personalId,
          },
          token: null // session-based token, no need for JWT
        }));

        // Navigate to home page after successful login
        router.push("/home");
        toast.success("Login successful!");
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Login failed.";
      toast.error(errorMessage);
      console.error("❌ Login error:", err);
      setError(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-100 to-blue-300 px-4">
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <motion.div
          className="text-center mb-6"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Welcome Back!</h1>
          <p className="text-gray-500">Login to book your appointment</p>
        </motion.div>

        <DynamicForm fields={loginFormFields} onSubmit={handleSubmit} buttonText={isLoading ? "Logging in..." : "Login"} />

        {error && (
          <motion.p
            className="text-red-500 text-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}

        <motion.div
          className="text-center pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-blue-600 font-semibold hover:underline">
              Register
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
