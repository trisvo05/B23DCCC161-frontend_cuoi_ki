// File này định nghĩa types cho user service - chỉ profile

// Re-export User type từ auth (vì backend user entity giống nhau)
export type { User } from '@/services/auth/typing';

// Response cho profile từ GET /api/auth/profile
export interface ProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

// Validation response
export interface ValidationResponse {
  valid: boolean;
  user?: User;
}