export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  current_address: string;
  profile_image_url: string | null;
  balance: number;
  is_user_verified: boolean;
  is_user_active: boolean;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Admin {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface Service {
  id: number;
  name: string;
  is_active: boolean;
}

export interface Subscription {
  id: number;
  name: string;
  duration_days: number;
  price: number;
  is_active: boolean;
}

export interface UserSubscription {
  id: number;
  user_id: number;
  subscription_id: number;
  subscription?: Subscription;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface PaymentChannel {
  id: number;
  name: string;
  is_active: boolean;
}

export interface Payment {
  id: number;
  user_id: number;
  user?: User;
  channel_id: number;
  channel?: PaymentChannel;
  transaction_id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  reject_reason: string | null;
  created_at: string;
}

export interface ServiceUsage {
  id: number;
  user_id: number;
  service_id: number;
  service?: Service;
  cost: number;
  used_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: User;
  admin?: Admin;
}

export interface ApiError {
  detail: string;
}

export type Theme = 'light' | 'dark';
