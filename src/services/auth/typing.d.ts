// File này định nghĩa types KHỚP 100% với backend NestJS DTOs và APIs thực tế

// Khớp với backend/src/auth/dto/login.dto.ts
export interface LoginRequest {
  username: string; // Email hoặc username
  password: string;
}

// Khớp với backend/src/auth/dto/register.dto.ts  
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone?: string;
  role: 'admin' | 'student';  // Khớp với user-role.enum.ts
}

// Khớp với backend/src/auth/dto/forgot-password.dto.ts
export interface ForgotPasswordRequest {
  email: string;
}

// Reset password request (POST /api/auth/reset-password)
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Khớp với backend/src/users/entities/user.entity.ts
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'student';           // Khớp với user-role.enum.ts
  status: 'active' | 'inactive' | 'pending';  // Khớp với user-status.enum.ts
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

// Response từ backend auth controller (login, register)
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;      // JWT token từ backend NestJS
    refresh_token?: string;    // Nếu backend có refresh token
    user: User;                // User entity từ backend
  };
}

// Response từ GET /api/auth/profile
export interface ProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

// Response từ POST /api/auth/forgot-password
export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    resetToken?: string;     // Nếu backend trả về token
    expiresAt?: string;      // Thời gian hết hạn
  };
}

// Response từ POST /api/auth/reset-password
export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// Response từ GET /api/auth/admin-dashboard
export interface AdminDashboardResponse {
  success: boolean;
  message: string;
  data: {
    totalUsers?: number;
    totalStudents?: number;
    totalAdmins?: number;
    recentActivity?: any[];
    // Thêm fields khác khi backend implement
  };
}

// Response từ GET /api/auth/student-dashboard  
export interface StudentDashboardResponse {
  success: boolean;
  message: string;
  data: {
    profile: User;
    applications?: any[];     // Đơn xét tuyển (tương lai)
    notifications?: any[];    // Thông báo
    // Thêm fields khác khi backend implement
  };
}

// Logout response (nếu có logout API)
export interface LogoutResponse {
  success: boolean;
  message: string;
}

// Error response từ backend NestJS (Global Exception Filter)
export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  statusCode: number;
  timestamp?: string;
  path?: string;
}

// Generic API response wrapper từ backend
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode?: number;
}