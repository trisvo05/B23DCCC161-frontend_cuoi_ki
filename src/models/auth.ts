// File này quản lý auth state và KẾT NỐI với backend NestJS qua services/auth

import { Effect, Reducer, AnyAction } from 'umi';
import { history } from 'umi';
import { message } from 'antd';
import authService from '@/services/auth';
import { setToken, setUserInfo, removeToken, removeUserInfo, getUserInfo } from '@/utils/auth';
import type { User } from '@/services/auth/typing';

export interface AuthModelState {
  currentUser?: User;
  loading: boolean;
  loginLoading: boolean;
  registerLoading: boolean;
}

export interface AuthModelType {
  namespace: 'auth';
  state: AuthModelState;
  effects: {
    login: Effect;
    register: Effect;
    logout: Effect;
    getCurrentUser: Effect;
    forgotPassword: Effect;
    resetPassword: Effect;
  };
  reducers: {
    setCurrentUser: Reducer<AuthModelState>;
    setLoading: Reducer<AuthModelState>;
    setLoginLoading: Reducer<AuthModelState>;
    setRegisterLoading: Reducer<AuthModelState>;
    clearAuth: Reducer<AuthModelState>;
  };
}

const AuthModel: AuthModelType = {
  namespace: 'auth',

  state: {
    currentUser: getUserInfo(), // Lấy từ localStorage khi init
    loading: false,
    loginLoading: false,
    registerLoading: false,
  },

  effects: {
    // Đăng nhập
    *login({ payload }, { call, put }) {
      try {
        yield put({ type: 'setLoginLoading', payload: true });

        console.log('🔑 Login request:', payload);

        const response = yield call(authService.login, payload);

        console.log('🔑 Login response:', response);

        // Backend trả về: { success: true, message: '...', user: {...}, token: '...' }
        if (response?.success && response?.token && response?.user) {
          const { token, user } = response;

          // Lưu vào localStorage
          setToken(token);
          setUserInfo(user);

          // Update Redux state
          yield put({ type: 'setCurrentUser', payload: user });

          message.success('Đăng nhập thành công!');

          // FORCE redirect theo role (dùng replace để không thể quay lại)
          if (user.role === 'admin') {
            history.replace('/admin/dashboard');
          } else if (user.role === 'student') {
            history.replace('/student/dashboard');
          } else {
            history.replace('/dashboard');
          }
        } else {
          console.error('❌ Invalid login response:', response);
          message.error('Đăng nhập thất bại - Phản hồi không hợp lệ');
        }
      } catch (error: any) {
        console.error('❌ Login error:', error);

        // Xử lý error message từ backend
        let errorMessage = 'Đăng nhập thất bại';
        
        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (!navigator.onLine) {
          errorMessage = 'Không có kết nối internet';
        }

        message.error(errorMessage);
      } finally {
        yield put({ type: 'setLoginLoading', payload: false });
      }
    },

    // Đăng ký
    *register({ payload }, { call, put }) {
      try {
        yield put({ type: 'setRegisterLoading', payload: true });

        console.log('📝 Register request:', payload);

        const response = yield call(authService.register, payload);

        console.log('📝 Register response:', response);

        if (response?.success) {
          message.success(response.message || 'Đăng ký thành công! Vui lòng đăng nhập.');
          // Redirect về login
          history.replace('/auth/login');
        } else {
          message.error(response?.message || 'Đăng ký thất bại');
        }
      } catch (error: any) {
        console.error('❌ Register error:', error);

        let errorMessage = 'Đăng ký thất bại';
        
        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        message.error(errorMessage);
      } finally {
        yield put({ type: 'setRegisterLoading', payload: false });
      }
    },

    // Đăng xuất - QUAN TRỌNG
    *logout(_, { put }) {
      try {
        console.log('🚪 Logging out...');

        // Clear localStorage TRƯỚC
        removeToken();
        removeUserInfo();

        // Clear Redux state
        yield put({ type: 'clearAuth' });

        // FORCE redirect về login (không thể quay lại)
        history.replace('/auth/login');

        message.success('Đăng xuất thành công!');
      } catch (error) {
        console.error('❌ Logout error:', error);
        
        // Dù có lỗi vẫn phải clear và redirect
        removeToken();
        removeUserInfo();
        yield put({ type: 'clearAuth' });
        history.replace('/auth/login');
      }
    },

    // Lấy thông tin user hiện tại
    *getCurrentUser(_, { call, put }) {
      try {
        yield put({ type: 'setLoading', payload: true });

        const response = yield call(authService.getProfile);

        if (response?.success && response?.user) {
          const user = response.user;
          setUserInfo(user); // Update localStorage
          yield put({ type: 'setCurrentUser', payload: user });
        } else {
          // Invalid token hoặc user không tồn tại
          removeToken();
          removeUserInfo();
          yield put({ type: 'clearAuth' });
          history.replace('/auth/login');
        }
      } catch (error: any) {
        console.error('❌ Get current user error:', error);
        
        // Clear auth data nếu có lỗi (token expired, etc.)
        removeToken();
        removeUserInfo();
        yield put({ type: 'clearAuth' });
        history.replace('/auth/login');
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    // Quên mật khẩu
    *forgotPassword({ payload }, { call, put }) {
      try {
        yield put({ type: 'setLoading', payload: true });

        const response = yield call(authService.forgotPassword, payload);

        if (response?.success) {
          message.success(response.message || 'Email khôi phục mật khẩu đã được gửi!');
        } else {
          message.error(response?.message || 'Gửi email thất bại');
        }
      } catch (error: any) {
        console.error('❌ Forgot password error:', error);
        
        const errorMessage = error?.response?.data?.message || error?.message || 'Gửi email thất bại';
        message.error(errorMessage);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    // Reset mật khẩu
    *resetPassword({ payload }, { call, put }) {
      try {
        yield put({ type: 'setLoading', payload: true });

        const response = yield call(authService.resetPassword, payload);

        if (response?.success) {
          message.success(response.message || 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập.');
          history.replace('/auth/login');
        } else {
          message.error(response?.message || 'Đặt lại mật khẩu thất bại');
        }
      } catch (error: any) {
        console.error('❌ Reset password error:', error);
        
        const errorMessage = error?.response?.data?.message || error?.message || 'Đặt lại mật khẩu thất bại';
        message.error(errorMessage);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
  },

  reducers: {
    setCurrentUser(state, action) {
      console.log('🔄 Setting current user:', action.payload);
      return {
        ...state,
        currentUser: action.payload,
      };
    },

    setLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },

    setLoginLoading(state, action) {
      return {
        ...state,
        loginLoading: action.payload,
      };
    },

    setRegisterLoading(state, action) {
      return {
        ...state,
        registerLoading: action.payload,
      };
    },

    clearAuth(state) {
      console.log('🧹 Clearing auth state');
      return {
        ...state,
        currentUser: undefined,
        loading: false,
        loginLoading: false,
        registerLoading: false,
      };
    },
  },
};

export default AuthModel;