'use client';

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from 'next/navigation';
import axiosInstance from "@/api/axios";
import DynamicForm from "@/components/DynamicForm";
import { loginFormFields, registerFormFields } from "../constant/formFeilds";
import { RootState } from "@/store/store";
import { resetForm } from "@/store/services/slices/formSlice";
import { useLoginMutation, useRegisterMutation, useUserInfoQuery } from "@/store/services/api/authApi";
import { skip } from "node:test";
import { toast, ToastContainer } from "react-toastify";

export default function RegisterForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { auth } = useSelector((state: RootState) => state);

  const [error, setError] = useState("");
  const formData = useSelector((state: RootState) => state.form); 
// skip when doesn't have formData.phoneNumber
  const [register, { data, isSuccess, isLoading }] = useRegisterMutation();
  const shouldSkip = !formData.phoneNumber || !formData.password;
  // const { refetch } = useUserInfoQuery(undefined, { skip: true });

 console.log(data, "data")

  useEffect(() => {
    if(auth.isAuthenticated){
      router.push("/home");
    }
  }, [auth.isAuthenticated, router]);

  const handleSubmit = async () => {
    try {
      const { name, phoneNumber, password } = formData;

      // await login({ phone_number: phoneNumber, password }).then((result: any) => {
      if (shouldSkip) {
        setError("Phone number and password are required.");
        return;
      }
      await register({name, phone_number: phoneNumber, password }).then((result: any) => {
      if ('data' in result) {
          router.push('/login');

          toast.success(data?.message || "Register successful")

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
    <ToastContainer />
      <DynamicForm fields={registerFormFields} onSubmit={handleSubmit} buttonText="Register" />
      <p className="text-center pt-2">Don&apos;t have an account? <a href="/login" className="text-blue-500">Login</a></p>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </>
  );
}
