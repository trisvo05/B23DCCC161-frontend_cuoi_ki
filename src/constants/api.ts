// File này định nghĩa endpoints để KẾT NỐI với backend NestJS

// Base URL của backend NestJS
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api'  // URL backend NestJS trong dev
  : '/api';

export const API_ENDPOINTS = {
  // Auth endpoints - KẾT NỐI với backend/src/auth/auth.controller.ts
  LOGIN: `${API_BASE_URL}/auth/login`,                    // POST /auth/login
  REGISTER: `${API_BASE_URL}/auth/register`,              // POST /auth/register  
  LOGOUT: `${API_BASE_URL}/auth/logout`,                  // POST /auth/logout
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,          // POST /auth/refresh
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`, // POST /auth/forgot-password
  
  // User endpoints - KẾT NỐI với backend/src/users/users.controller.ts
  GET_PROFILE: `${API_BASE_URL}/users/profile`,           // GET /users/profile
  UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,        // PUT /users/profile
  GET_USERS: `${API_BASE_URL}/users`,                     // GET /users
  GET_USER_BY_ID: `${API_BASE_URL}/users`,                // GET /users/:id
  UPDATE_USER: `${API_BASE_URL}/users`,                   // PUT /users/:id
  DELETE_USER: `${API_BASE_URL}/users`,                   // DELETE /users/:id
  
  // Admin endpoints - KẾT NỐI với backend/src/admin (tương lai)
  ADMIN_DASHBOARD: `${API_BASE_URL}/admin/dashboard`,      // GET /admin/dashboard
  
  // Student endpoints - KẾT NỐI với backend/src/students (tương lai)  
  STUDENT_DASHBOARD: `${API_BASE_URL}/students/dashboard`, // GET /students/dashboard
} as const;

export { API_BASE_URL };