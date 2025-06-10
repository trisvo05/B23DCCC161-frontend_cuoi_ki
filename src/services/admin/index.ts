// File này đơn giản vì dashboard để trống

import request from '@/utils/request';

/**
 * Kiểm tra admin có thể truy cập dashboard không
 * KẾT NỐI backend GET /api/auth/admin-dashboard
 */
export async function checkAdminAccess(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await request('/auth/admin-dashboard', {
      method: 'GET',
    });
    return response;
  } catch (error) {
    return {
      success: false,
      message: 'Không có quyền truy cập admin dashboard'
    };
  }
}

// Chỉ cần 1 function để check access thôi - dashboard trống