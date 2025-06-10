// File này KẾT NỐI với backend qua auth/profile endpoint

import request from '@/utils/request';
import type { 
  ProfileResponse,
  ValidationResponse,
} from './typing';

/**
 * Lấy profile user hiện tại - KẾT NỐI backend GET /api/auth/profile
 * Cần JWT token trong header Authorization
 */
export async function getProfile(): Promise<ProfileResponse> {
  return request('/auth/profile', {
    method: 'GET',
  });
}

/**
 * Kiểm tra token có hợp lệ không - SỬ DỤNG profile endpoint
 * Nếu get profile thành công = token hợp lệ
 */
export async function validateToken(): Promise<ValidationResponse> {
  try {
    const response = await getProfile();
    
    if (response.success) {
      return {
        valid: true,
        user: response.data,
      };
    } else {
      return {
        valid: false,
      };
    }
  } catch (error) {
    return {
      valid: false,
    };
  }
}
