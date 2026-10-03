export interface MerchantType {
  type_id: number;
  nama_jenis: string;
}

export interface RegisterPayload {
  nama_lengkap: string;
  no_whatsapp: string;
  email?: string;
  nama_usaha: string;
  alamat_usaha: string;
  type_id: number;
  password?: string;
  confirm_password?: string;
}

export interface LoginPayload {
  identifier: string;
  password?: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: number;
    nama_lengkap: string;
    role: string;
    nama_usaha?: string;
  };
}
