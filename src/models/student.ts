// File này quản lý student state - dashboard trống nhưng check quyền từ backend

import { Effect, Reducer } from 'dva';
import type { AnyAction } from 'redux';
import { message } from 'antd';
import * as studentService from '@/services/student';

export interface StudentModelState {
  hasAccess: boolean;
  loading: boolean;
  dashboardData?: any; // Để trống vì dashboard trống
}

export interface StudentModelType {
  namespace: 'student';
  state: StudentModelState;
  effects: {
    checkAccess: Effect;
  };
  reducers: {
    setAccess: Reducer<StudentModelState>;
    setLoading: Reducer<StudentModelState>;
    clearStudent: Reducer<StudentModelState>;
  };
}

const StudentModel: StudentModelType = {
  namespace: 'student',

  state: {
    hasAccess: false,
    loading: false,
    dashboardData: null,
  },

  effects: {
    // Kiểm tra quyền student - GỌI API BACKEND
    *checkAccess(action: AnyAction, { call, put }: any): any {
      yield put({ type: 'setLoading', payload: true });
      
      try {
        // GỌI backend GET /api/auth/student-dashboard để check quyền
        const response: any = yield call(studentService.checkStudentAccess);
        
        if (response.success) {
          yield put({ type: 'setAccess', payload: true });
          message.success('Chào mừng Thí sinh!');
          return true;
        } else {
          yield put({ type: 'setAccess', payload: false });
          message.error('Bạn không có quyền student');
          return false;
        }
      } catch (error: any) {
        console.error('Student access check error:', error);
        yield put({ type: 'setAccess', payload: false });
        
        if (error?.response?.status === 403) {
          message.error('Bạn không có quyền student');
        } else {
          message.error('Lỗi kiểm tra quyền student');
        }
        return false;
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
  },

  reducers: {
    setAccess(state: StudentModelState, action: AnyAction) {
      return {
        ...state,
        hasAccess: action.payload,
      };
    },

    setLoading(state: StudentModelState, action: AnyAction) {
      return {
        ...state,
        loading: action.payload,
      };
    },

    clearStudent(state: StudentModelState) {
      return {
        ...state,
        hasAccess: false,
        loading: false,
        dashboardData: null,
      };
    },
  },
};

export default StudentModel;