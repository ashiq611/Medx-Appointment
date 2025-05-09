'use client';

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import DynamicForm from "@/components/DynamicForm";
import { registerFormFields } from "../constant/formFeilds";
import { RootState } from "@/store/store";
import { resetForm } from "@/store/services/slices/formSlice";
import { useRegisterMutation } from "@/store/services/api/authApi";

export default function RegisterForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { auth } = useSelector((state: RootState) => state);
  const formData = useSelector((state: RootState) => state.form);

  const [error, setError] = useState("");
  const [register, { isLoading }] = useRegisterMutation();
  const shouldSkip = !formData.phoneNumber || !formData.password;

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push("/home");
    }
  }, [auth.isAuthenticated, router]);

  const handleSubmit = async () => {
    try {
      const { name, phoneNumber, password } = formData;

      if (shouldSkip) {
        setError("Phone number and password are required.");
        return;
      }

      const result = await register({ name, phone_number: phoneNumber, password });

      if ('data' in result) {
        toast.success(result.data.message || "Register successful!");
        router.push('/login');
      }

      dispatch(resetForm());
    } catch (err: any) {
      console.error("❌ Register error:", err);
      setError(err?.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-green-100 to-green-300 px-4">
      <ToastContainer />
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
          <h1 className="text-3xl font-bold text-green-700 mb-2">Create Account</h1>
          <p className="text-gray-500">Register to book your appointment</p>
        </motion.div>

        <DynamicForm fields={registerFormFields} onSubmit={handleSubmit} buttonText={isLoading ? "Registering..." : "Register"}  headText="Register"/>

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
            Already have an account?{" "}
            <a href="/login" className="text-green-600 font-semibold hover:underline">
              Login
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
