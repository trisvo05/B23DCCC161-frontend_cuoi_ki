
// Khớp với backend/src/common/enums/user-role.enum.ts
export const USER_ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
} as const;

// Khớp với backend/src/common/enums/user-status.enum.ts
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive', 
  PENDING: 'pending',
} as const;

// Key để lưu trong localStorage (chỉ dùng để cache, không phải business logic)
export const AUTH_STORAGE_KEYS = {
  TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
  USER_ROLE: 'user_role',
} as const;

export const TOKEN_EXPIRES_TIME = 24 * 60 * 60 * 1000; // 24 hours

// Types export để dùng trong toàn bộ app
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];