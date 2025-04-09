'use client';

import { useSelector } from "react-redux";
import { RootState } from "@/services/store";
import { useState } from "react";


import axiosInstance from "@/api/axios";
import DynamicForm from "@/components/DynamicForm";
import { loginFormFields } from "../constant/formFeilds";
import { useRouter } from 'next/navigation'
import { resetForm } from "@/services/slices/formSlice";

export default function LoginForm() {
  const formData = useSelector((state: RootState) => state.form);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
 
    try {
      const response = await axiosInstance.post("/auth/login", {
        phone_number: formData.phoneNumber,
        password: formData.password,
      });

      console.log("✅ Login successful:", response.data);
      alert(`Login successful: ${response.data.data.otp}`);

      resetForm();

      router.push("/verify");
      

      // setUser();
      // Set auth state or redirect here
    } catch (err: any) {
      console.error("❌ Login error:", err);
      setError(err?.response?.data?.message || "Login failed.");
    }
  };

  return (
    <>
      <DynamicForm fields={loginFormFields} onSubmit={handleSubmit} buttonText="Login" />
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </>
  );
}
