"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";

import { useRouter } from "next/navigation";
import { loginUser } from "@/api/api";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    const res = await dispatch<any>(loginUser(phone, password));
    if (res?.type === "auth/loginSuccess") {
      router.push("/dashboard");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl mb-4">Login</h1>
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 mb-2 block w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-4 block w-full"
      />
      <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2">
        Login
      </button>
    </div>
  );
}
