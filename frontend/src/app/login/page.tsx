'use client';

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from 'next/navigation';
import axiosInstance from "@/api/axios";
import DynamicForm from "@/components/DynamicForm";
import { loginFormFields } from "../constant/formFeilds";
import { RootState } from "@/store/store";
import { resetForm } from "@/store/services/slices/formSlice";
import { useLoginMutation, useUserInfoQuery } from "@/store/services/api/authApi";

export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { auth } = useSelector((state: RootState) => state);

  const [error, setError] = useState("");
  const formData = useSelector((state: RootState) => state.form); 

  const [login, { data, isSuccess, isLoading }] = useLoginMutation();
  // const { refetch } = useUserInfoQuery(undefined, { skip: true });



  useEffect(() => {
    if(auth.isAuthenticated){
      router.push("/dashboard");
    }
  }, [auth.isAuthenticated, router]);

  const handleSubmit = async () => {
    try {
      const { phoneNumber, password } = formData;

      await login({ phone_number: phoneNumber, password }).then((result: any) => {
        
      if ('data' in result) {
        // setTimeout(() => {
          router.push('/dashboard');

      }
      }
      );
      


      dispatch(resetForm()); 
      // isSuccess && router.push("/dashboard");
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
