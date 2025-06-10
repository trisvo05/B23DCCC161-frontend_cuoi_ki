// src/pages/auth/register/index.tsx

import React, { useEffect } from 'react';
import { history } from 'umi';
import { getToken, getUserInfo } from '@/utils/auth';
import RegisterForm from '@/components/Auth/RegisterForm';

const RegisterPage: React.FC = () => {
  
  useEffect(() => {
    // BLOCK: Nếu đã đăng nhập → FORCE redirect về dashboard
    const token = getToken();
    const user = getUserInfo();
    
    if (token && user) {
      console.log('🔒 Already logged in, redirecting to dashboard');
      
      if (user.role === 'admin') {
        history.replace('/admin/dashboard');
      } else if (user.role === 'student') {
        history.replace('/student/dashboard');
      }
      return;
    }
  }, []);

  return <RegisterForm />;
};

export default RegisterPage;