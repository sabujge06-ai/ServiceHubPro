import { AuthResponse, User, Admin, Service, Subscription, UserSubscription, Payment, PaymentChannel, ServiceUsage } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.3.110:3000/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || 'Request failed');
    }
    return response.json();
  }

  // Auth endpoints
  async register(data: { name: string; email: string; phone_number: string; password: string; current_address: string }): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/auth/verify-email/${token}`);
    return this.handleResponse<{ message: string }>(response);
  }

  // Admin Auth
  async adminLogin(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  // User endpoints
  async getUserProfile(): Promise<User> {
    const response = await fetch(`${this.baseUrl}/user/profile`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<User>(response);
  }

  async getUserServices(): Promise<Service[]> {
    const response = await fetch(`${this.baseUrl}/user/services`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Service[]>(response);
  }

  async useService(serviceId: number): Promise<ServiceUsage> {
    const response = await fetch(`${this.baseUrl}/user/use-service`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ service_id: serviceId }),
    });
    return this.handleResponse<ServiceUsage>(response);
  }

  async addPayment(data: { channel_id: number; transaction_id: string; amount: number }): Promise<Payment> {
    const response = await fetch(`${this.baseUrl}/user/add-payment`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Payment>(response);
  }

  async getUserPayments(): Promise<Payment[]> {
    const response = await fetch(`${this.baseUrl}/user/payments`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Payment[]>(response);
  }

  async getUserSubscriptions(): Promise<UserSubscription[]> {
    const response = await fetch(`${this.baseUrl}/user/subscriptions`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<UserSubscription[]>(response);
  }

  async buySubscription(subscriptionId: number): Promise<UserSubscription> {
    const response = await fetch(`${this.baseUrl}/user/buy-subscription`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ subscription_id: subscriptionId }),
    });
    return this.handleResponse<UserSubscription>(response);
  }

  // Admin endpoints
  async getAdminUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseUrl}/admin/users`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<User[]>(response);
  }

  async activateUser(userId: number): Promise<User> {
    const response = await fetch(`${this.baseUrl}/admin/user/${userId}/activate`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<User>(response);
  }

  async verifyUser(userId: number): Promise<User> {
    const response = await fetch(`${this.baseUrl}/admin/user/${userId}/verify`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<User>(response);
  }

  async getAdminServices(): Promise<Service[]> {
    const response = await fetch(`${this.baseUrl}/admin/services`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Service[]>(response);
  }

  async toggleService(serviceId: number): Promise<Service> {
    const response = await fetch(`${this.baseUrl}/admin/service/${serviceId}/toggle`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Service>(response);
  }

  async getAdminSubscriptions(): Promise<Subscription[]> {
    const response = await fetch(`${this.baseUrl}/admin/subscriptions`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Subscription[]>(response);
  }

  async toggleSubscription(subscriptionId: number): Promise<Subscription> {
    const response = await fetch(`${this.baseUrl}/admin/subscription/${subscriptionId}/toggle`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Subscription>(response);
  }

  async getAdminPayments(): Promise<Payment[]> {
    const response = await fetch(`${this.baseUrl}/admin/payments`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Payment[]>(response);
  }

  async approvePayment(paymentId: number): Promise<Payment> {
    const response = await fetch(`${this.baseUrl}/admin/payment/${paymentId}/approve`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Payment>(response);
  }

  async rejectPayment(paymentId: number, reason: string): Promise<Payment> {
    const response = await fetch(`${this.baseUrl}/admin/payment/${paymentId}/reject`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });
    return this.handleResponse<Payment>(response);
  }

  async getPaymentChannels(): Promise<PaymentChannel[]> {
    const response = await fetch(`${this.baseUrl}/admin/payment-channels`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<PaymentChannel[]>(response);
  }

  async createPaymentChannel(name: string): Promise<PaymentChannel> {
    const response = await fetch(`${this.baseUrl}/admin/payment-channel`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    return this.handleResponse<PaymentChannel>(response);
  }

  async updatePaymentChannel(channelId: number, data: { name?: string; is_active?: boolean }): Promise<PaymentChannel> {
    const response = await fetch(`${this.baseUrl}/admin/payment-channel/${channelId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<PaymentChannel>(response);
  }

  async deletePaymentChannel(channelId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/admin/payment-channel/${channelId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || 'Request failed');
    }
  }
}

export const api = new ApiClient(API_BASE_URL);
