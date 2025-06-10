// File này đơn giản vì dashboard để trống

import request from '@/utils/request';

/**
 * Kiểm tra student có thể truy cập dashboard không
 * KẾT NỐI backend GET /api/auth/student-dashboard  
 */
export async function checkStudentAccess(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await request('/auth/student-dashboard', {
      method: 'GET',
    });
    return response;
  } catch (error) {
    return {
      success: false,
      message: 'Không có quyền truy cập student dashboard'
    };
  }
}

// Chỉ cần 1 function để check access thôi - dashboard trống