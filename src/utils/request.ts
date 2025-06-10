// File này cấu hình HTTP client để KẾT NỐI TRỰC TIẾP với backend NestJS

import { extend } from 'umi-request';
import { message } from 'antd';
import { getToken, removeToken } from './auth';
import { API_BASE_URL } from '@/constants/api';
import { ROUTES } from '@/constants/routes';

/**
 * Cấu hình request instance để kết nối backend NestJS
 */
const request = extend({
  prefix: API_BASE_URL,
  timeout: 10000,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  errorHandler: (error: any) => {
    // Xử lý lỗi global cho umi-request
    console.error('Request error:', error);
    
    const { response } = error;
    
    if (response && response.status) {
      const { status } = response;
      
      switch (status) {
        case 401:
          message.error('Phiên đăng nhập đã hết hạn');
          removeToken();
          window.location.href = ROUTES.LOGIN;
          break;
        case 403:
          message.error('Bạn không có quyền truy cập');
          break;
        case 404:
          message.error('Không tìm thấy tài nguyên');
          break;
        case 500:
          message.error('Lỗi máy chủ, vui lòng thử lại');
          break;
        default:
          message.error('Có lỗi xảy ra');
      }
    } else {
      // Lỗi kết nối
      message.error('Không thể kết nối tới máy chủ');
    }
    
    throw error;
  },
});

/**
 * Request interceptor - Tự động thêm JWT token vào header
 */
request.interceptors.request.use((url, options) => {
  const token = getToken();
  
  if (token) {
    return {
      url,
      options: {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      },
    };
  }
  
  return { url, options };
});

export default request;