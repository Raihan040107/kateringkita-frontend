import api from "@/lib/axios";
import { MerchantType, RegisterPayload, LoginPayload, AuthResponse } from "@/types/auth";

export const getMerchantTypes = async (): Promise<MerchantType[]> => {
  const response = await api.get<MerchantType[]>("/auth/types");
  return response.data;
};

export const registerMerchant = async (data: RegisterPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const logoutUser = async (): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/auth/logout");
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await api.get("/auth/admin/users");
  return response.data;
};
