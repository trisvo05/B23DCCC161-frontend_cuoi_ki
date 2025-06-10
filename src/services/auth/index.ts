import { request } from 'umi';
import type { LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from './typing';

const API_BASE = 'http://localhost:3001/api';

class AuthService {
  async login(data: LoginRequest) {
    return request(`${API_BASE}/auth/login`, {
      method: 'POST',
      data,
    });
  }

  async register(data: RegisterRequest) {
    return request(`${API_BASE}/auth/register`, {
      method: 'POST',
      data,
    });
  }

  async getProfile() {
    return request(`${API_BASE}/auth/profile`, {
      method: 'GET',
    });
  }

  async forgotPassword(data: ForgotPasswordRequest) {
    return request(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      data,
    });
  }

  async resetPassword(data: ResetPasswordRequest) {
    return request(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      data,
    });
  }

  async logout() {
    return request(`${API_BASE}/auth/logout`, {
      method: 'POST',
    });
  }
}

export default new AuthService();