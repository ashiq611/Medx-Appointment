"use client";

import DynamicForm from "@/components/DynamicForm";
import { verifyOtpFormFields } from "../constant/formFeilds";
import { useState } from "react";
import axiosInstance from "@/api/axios";

export default function Verify() {
      const [error, setError] = useState("");

      const handleSubmit = async (formData: any) => {
        try {
          const response = await axiosInstance.post("/auth/verify-otp", {
            token: formData.otp,
          });
          console.log("✅ OTP verification successful:", response.data);
          alert(`OTP verification successful: ${response.data.data.otp}`);
          // Handle successful OTP verification (e.g., redirect to dashboard)
        } catch (err: any) {
          console.error("❌ OTP verification error:", err);
          setError(err?.response?.data?.message || "OTP verification failed.");
        }
      };
    return (
        <>
        <DynamicForm fields={verifyOtpFormFields} onSubmit={handleSubmit} buttonText="Login" />
              {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </>
    );
}