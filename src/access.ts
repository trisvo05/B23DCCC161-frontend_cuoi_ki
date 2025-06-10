// File này định nghĩa quyền truy cập cho routes

import type { IInitialState } from './services/base/typing';
import { getUserInfo } from '@/utils/auth';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: IInitialState) {
  // Lấy user info từ localStorage hoặc initialState
  const currentUser = initialState?.currentUser || getUserInfo();
  const isAuthenticated = !!currentUser;
  const userRole = currentUser?.role;

  // Giữ nguyên logic cũ cho hệ thống phân quyền phức tạp
  const scopes = initialState.authorizedPermissions?.map((item) => item.scopes).flat();

  return {
    ///////////////////////////////////
    // AUTH SYSTEM MỚI - Role-based access
    
    // Admin access
    admin: isAuthenticated && userRole === 'admin',
    
    // Student access  
    student: isAuthenticated && userRole === 'student',
    
    // Any authenticated user
    authenticated: isAuthenticated,

    // Guest (not logged in)
    guest: !isAuthenticated,

    ///////////////////////////////////
    // HỆ THỐNG CŨ - Giữ nguyên để tương thích
    
    // Các comment cũ để backup
    // canBoQLKH: token && vaiTro && vaiTro === 'can_bo_qlkh',
    // lanhDao: token && vaiTro && vaiTro === 'lanh_dao',
    // sinhVienVaNhanVien: token && vaiTro && ['nhan_vien', 'sinh_vien'].includes(vaiTro),
    // adminVaCanBoQLKH: token && vaiTro && ['Admin', 'can_bo_qlkh'].includes(vaiTro),
    // nhanVienVaCanBoQLKH: token && vaiTro && ['nhan_vien', 'can_bo_qlkh'].includes(vaiTro),
    // adminVaQuanTri: token && vaiTro && ['Admin', 'quan_tri'].includes(vaiTro),
    // admin: (token && vaiTro && vaiTro === 'Admin') || false,
    // nhanVien: (token && vaiTro && vaiTro === 'nhan_vien') || false,
    // keToan: (token && vaiTro && vaiTro === 'ke_toan') || false,
    // sinhVien: (token && vaiTro && vaiTro === 'sinh_vien') || false,
    // quanTri: (token && vaiTro && vaiTro === 'quan_tri') || false,
    // chuyenVien: (token && vaiTro && vaiTro === 'chuyen_vien') || false,
    
    // Filters cũ - vẫn giữ để tương thích
    accessFilter: (route: any) => scopes?.includes(route?.maChucNang) || false,
    manyAccessFilter: (route: any) => route?.listChucNang?.some((role: string) => scopes?.includes(role)) || false,
    
    // Route filters mới cho auth system
    adminRouteFilter: (route: any) => {
      return isAuthenticated && userRole === 'admin';
    },
    
    studentRouteFilter: (route: any) => {
      return isAuthenticated && userRole === 'student';
    },
    
    authRouteFilter: (route: any) => {
      return isAuthenticated;
    },
  };
}