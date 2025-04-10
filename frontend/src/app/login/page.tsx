'use client';



import { use, useEffect, useState } from "react";
import axiosInstance from "@/api/axios";
import DynamicForm from "@/components/DynamicForm";
import { loginFormFields } from "../constant/formFeilds";
import { useRouter } from 'next/navigation'


import { useAuthStore, useFormStore } from "@/store/useStore";

export default function LoginForm() {
  const { formData, resetFormData } = useFormStore();
  const { login, loading, isAuthenticated } = useAuthStore((state) => (
  state));

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push("/dashboard"); // Redirect logged-in users
  //   }
  // }
  // , [isAuthenticated]);


  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
 
    try {

      const phoneNumber = formData.phoneNumber;
      const password = formData.password;

      // Call the login function from the store
      await login(phoneNumber, password);
      // Reset form data after successful login
      resetFormData();
    
      router.push("/dashboard");
      

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
