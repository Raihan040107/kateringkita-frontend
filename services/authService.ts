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
