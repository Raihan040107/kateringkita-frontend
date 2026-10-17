"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerMerchant, logoutUser } from "@/services/authService";
import { LoginPayload, RegisterPayload } from "@/types/auth";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser(payload);
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login gagal, periksa data Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerMerchant(payload);
      alert(res.message || "Registrasi Berhasil! Silakan Login.");
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registrasi gagal, periksa data Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser().catch(() => {});
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  return { handleLogin, handleRegister, handleLogout, loading, error };
};
