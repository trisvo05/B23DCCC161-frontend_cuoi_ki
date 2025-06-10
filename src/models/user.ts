// File này quản lý user profile state và KẾT NỐI với backend NestJS

import { Effect, Reducer } from 'umi';
import type { AnyAction } from 'redux';
import { message } from 'antd';
import * as userService from '@/services/user';
import { setUserInfo } from '@/utils/auth';
import type { User } from '@/services/user/typing';

export interface UserModelState {
  profile?: User;
  loading: boolean;
  profileLoading: boolean;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    getProfile: Effect;
    validateToken: Effect;
  };
  reducers: {
    setProfile: Reducer<UserModelState>;
    setLoading: Reducer<UserModelState>;
    setProfileLoading: Reducer<UserModelState>;
    clearUser: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    profile: undefined,
    loading: false,
    profileLoading: false,
  },

  effects: {
    // Lấy profile user - GỌI API BACKEND GET /api/auth/profile
    *getProfile(action: AnyAction, { call, put }: any): any {
      yield put({ type: 'setProfileLoading', payload: true });
      
      try {
        // GỌI backend GET /api/auth/profile qua user service
        const response: any = yield call(userService.getProfile);
        
        if (response.success) {
          const user = response.data;
          
          // Cập nhật localStorage và state
          setUserInfo(user);
          yield put({ type: 'setProfile', payload: user });
          
          return user; // Return để component có thể sử dụng
        } else {
          message.error(response.message || 'Không thể lấy thông tin profile');
          return null;
        }
      } catch (error: any) {
        console.error('Get profile error:', error);
        if (error?.data?.message) {
          message.error(error.data.message);
        } else {
          message.error('Lỗi khi lấy thông tin profile');
        }
        return null;
      } finally {
        yield put({ type: 'setProfileLoading', payload: false });
      }
    },

    // Validate token - GỌI API BACKEND qua user service
    *validateToken(action: AnyAction, { call, put }: any): any {
      yield put({ type: 'setLoading', payload: true });
      
      try {
        // GỌI backend validation qua user service
        const response: any = yield call(userService.validateToken);
        
        if (response.valid && response.user) {
          // Token hợp lệ, cập nhật profile
          setUserInfo(response.user);
          yield put({ type: 'setProfile', payload: response.user });
          
          return { valid: true, user: response.user };
        } else {
          // Token không hợp lệ, clear user
          yield put({ type: 'clearUser' });
          return { valid: false };
        }
      } catch (error: any) {
        console.error('Validate token error:', error);
        // Token expired hoặc lỗi server
        yield put({ type: 'clearUser' });
        return { valid: false };
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
  },

  reducers: {
    setProfile(state: UserModelState, action: AnyAction) {
      return {
        ...state,
        profile: action.payload,
      };
    },

    setLoading(state: UserModelState, action: AnyAction) {
      return {
        ...state,
        loading: action.payload,
      };
    },

    setProfileLoading(state: UserModelState, action: AnyAction) {
      return {
        ...state,
        profileLoading: action.payload,
      };
    },

    clearUser(state: UserModelState) {
      return {
        ...state,
        profile: undefined,
        loading: false,
        profileLoading: false,
      };
    },
  },
};

export default UserModel;