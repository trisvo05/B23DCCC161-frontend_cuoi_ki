// File này quản lý admin state - dashboard trống nhưng check quyền từ backend

import { Effect, Reducer } from 'umi';
import type { AnyAction } from 'redux';
import { message } from 'antd';
import * as adminService from '@/services/admin';

export interface AdminModelState {
  hasAccess: boolean;
  loading: boolean;
  dashboardData?: any; // Để trống vì dashboard trống
}

export interface AdminModelType {
  namespace: 'admin';
  state: AdminModelState;
  effects: {
    checkAccess: Effect;
  };
  reducers: {
    setAccess: Reducer<AdminModelState>;
    setLoading: Reducer<AdminModelState>;
    clearAdmin: Reducer<AdminModelState>;
  };
}

const AdminModel: AdminModelType = {
  namespace: 'admin',

  state: {
    hasAccess: false,
    loading: false,
    dashboardData: null,
  },

  effects: {
    // Kiểm tra quyền admin - GỌI API BACKEND
    *checkAccess(action: AnyAction, { call, put }: any): any {
      yield put({ type: 'setLoading', payload: true });
      
      try {
        // GỌI backend GET /api/auth/admin-dashboard để check quyền
        const response: any = yield call(adminService.checkAdminAccess);
        
        if (response.success) {
          yield put({ type: 'setAccess', payload: true });
          message.success('Chào mừng Admin!');
          return true;
        } else {
          yield put({ type: 'setAccess', payload: false });
          message.error('Bạn không có quyền admin');
          return false;
        }
      } catch (error: any) {
        console.error('Admin access check error:', error);
        yield put({ type: 'setAccess', payload: false });
        
        if (error?.response?.status === 403) {
          message.error('Bạn không có quyền admin');
        } else {
          message.error('Lỗi kiểm tra quyền admin');
        }
        return false;
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
  },

  reducers: {
    setAccess(state: AdminModelState, action: AnyAction) {
      return {
        ...state,
        hasAccess: action.payload,
      };
    },

    setLoading(state: AdminModelState, action: AnyAction) {
      return {
        ...state,
        loading: action.payload,
      };
    },

    clearAdmin(state: AdminModelState) {
      return {
        ...state,
        hasAccess: false,
        loading: false,
        dashboardData: null,
      };
    },
  },
};

export default AdminModel;