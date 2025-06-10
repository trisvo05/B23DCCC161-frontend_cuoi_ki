// File này định nghĩa routes frontend, phân quyền dựa trên response từ backend

export const ROUTES = {
  // Auth routes - Public routes
  LOGIN: '/auth/login',
  REGISTER: '/auth/register', 
  FORGOT_PASSWORD: '/auth/forgot-password',
  
  // Dashboard routes - Protected routes, phân quyền dựa trên backend response
  WELCOME: '/welcome',
  ADMIN_DASHBOARD: '/admin/dashboard',      // Chỉ admin được vào (kiểm tra từ backend)
  STUDENT_DASHBOARD: '/student/dashboard',  // Chỉ student được vào (kiểm tra từ backend)
  
  // Legacy route - Kế thừa từ dự án cũ
  TRANG_CHU: '/trangchu',
  
  // Error routes
  NOT_FOUND: '/404',
  FORBIDDEN: '/403', 
  SERVER_ERROR: '/500',
} as const;

// Routes không cần đăng nhập
export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.WELCOME,
  ROUTES.NOT_FOUND,
  ROUTES.FORBIDDEN,
  ROUTES.SERVER_ERROR,
];

// Routes cần đăng nhập - sẽ kiểm tra token với backend
export const PROTECTED_ROUTES = [
  ROUTES.ADMIN_DASHBOARD,
  ROUTES.STUDENT_DASHBOARD, 
  ROUTES.TRANG_CHU,
];