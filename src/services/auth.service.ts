import api, { tokenManager } from './api';
import { AuthResponse, User, ApiResponse } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role: string;
  companyId?: string;
  documentNumber?: string;
  phone?: string;
  specialty?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken } = response.data.data;
      tokenManager.setTokens(accessToken, refreshToken);
    }
    
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    
    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken } = response.data.data;
      tokenManager.setTokens(accessToken, refreshToken);
    }
    
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      tokenManager.clearTokens();
      window.location.href = '/login';
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to get current user');
    }
    
    return response.data.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<ApiResponse<User>>('/auth/me', data);
    
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update profile');
    }
    
    return response.data.data;
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    const response = await api.post<ApiResponse>('/auth/change-password', data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to change password');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const response = await api.post<ApiResponse>('/auth/forgot-password', { email });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to send reset email');
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const response = await api.post<ApiResponse>('/auth/reset-password', {
      token,
      password,
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to reset password');
    }
  }

  isAuthenticated(): boolean {
    return !!tokenManager.getAccessToken();
  }
}

export default new AuthService();