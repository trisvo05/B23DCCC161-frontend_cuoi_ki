// import { Dispatch } from 'umi';
import { message } from 'antd';

export interface ApplicationRecord {
  id: number;
  school: string;
  major: string;
  fullName?: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AdmissionModelState {
  applications: ApplicationRecord[];
}

export interface AdmissionModelType {
  namespace: 'admission';
  state: AdmissionModelState;
  effects: {
    submitApplication: (
      action: { payload: any },
      effects: { call: any; put: any }
    ) => Generator<any, void, unknown>;
  };
  reducers: {
    saveApplication: (
      state: AdmissionModelState,
      action: { payload: ApplicationRecord }
    ) => AdmissionModelState;
  };
}

const AdmissionModel: AdmissionModelType = {
  namespace: 'admission',
  
  state: {
    applications: [
      {
        id: 1,
        school: 'Đại học Bách Khoa Hà Nội',
        major: 'Công nghệ thông tin',
        submissionDate: '15/10/2023',
        status: 'pending',
      },
      {
        id: 2,
        school: 'Đại học Quốc Gia Hà Nội',
        major: 'Kỹ thuật điện tử',
        submissionDate: '12/10/2023',
        status: 'approved',
      },
      {
        id: 3,
        school: 'Đại học Kinh tế Quốc dân',
        major: 'Kinh tế đối ngoại',
        submissionDate: '10/10/2023',
        status: 'rejected',
      },
    ],
  },
  
  effects: {
    *submitApplication({ payload }, { call, put }) {
      const today = new Date();
      const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
      
      const newApplication = {
        id: Date.now(), // Sử dụng timestamp làm ID
        school: payload.schoolName,
        major: payload.majorName,
        fullName: payload.fullName,
        submissionDate: formattedDate,
        status: 'pending' as const,
      };
      
      yield put({
        type: 'saveApplication',
        payload: newApplication,
      });
      
      message.success('Hồ sơ xét tuyển đã được gửi thành công!');
      
      // Điều hướng đến trang status sau khi submit
      window.location.href = '/admission/status';
    },
  },
  
  reducers: {
    saveApplication(state, { payload }) {
      return {
        ...state,
        applications: [...state.applications, payload],
      };
    },
  },
};

export default AdmissionModel; 