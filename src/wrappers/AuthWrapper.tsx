// src/wrappers/AuthWrapper.tsx

import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { Spin } from 'antd';
import type { ConnectProps } from 'umi';
import type { AuthModelState } from '@/models/auth';
import { getToken, getUserInfo } from '@/utils/auth';

interface AuthWrapperProps extends ConnectProps {
  children: React.ReactNode;
  auth: AuthModelState;
  dispatch: any;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ 
  children, 
  auth, 
  dispatch,
  location 
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    console.log('🔍 AuthWrapper mounted with location:', location?.pathname);
    
    const initializeAuth = () => {
      const currentPath = location?.pathname;
      const token = getToken();
      const user = getUserInfo();
      
      console.log('🔍 Auth Check:', { 
        currentPath, 
        hasToken: !!token, 
        hasUser: !!user,
        currentUser: !!auth.currentUser 
      });
      
      // RULE 1: Nếu có token + user → LUÔN redirect về dashboard (trừ khi đã ở đúng chỗ)
      if (token && user) {
        // Restore auth state nếu chưa có
        if (!auth.currentUser) {
          console.log('🔄 Restoring auth state');
          dispatch({
            type: 'auth/setCurrentUser', 
            payload: user,
          });
        }
        
        // FORCE redirect về dashboard nếu đang ở auth pages
        const isAuthPage = currentPath?.startsWith('/auth') || 
                          currentPath === '/welcome' || 
                          currentPath === '/';
        
        if (isAuthPage) {
          console.log('🔒 User logged in, forcing redirect to dashboard');
          if (user.role === 'admin') {
            history.replace('/admin/dashboard');
          } else if (user.role === 'student') {
            history.replace('/student/dashboard');
          }
          setIsInitialized(true);
          return;
        }
        
        // Check role-based access for protected pages
        if (currentPath?.startsWith('/admin') && user.role !== 'admin') {
          console.log('🚫 Admin access denied');
          history.replace('/403');
          setIsInitialized(true);
          return;
        }
        
        if (currentPath?.startsWith('/student') && user.role !== 'student') {
          console.log('🚫 Student access denied');
          history.replace('/403');
          setIsInitialized(true);
          return;
        }
        
        console.log('✅ Auth check passed for protected route');
      }
      
      // RULE 2: Nếu KHÔNG có token/user → ONLY allow auth pages
      if (!token || !user) {
        const isAuthPage = currentPath?.startsWith('/auth') || 
                          currentPath === '/welcome' || 
                          currentPath === '/';
        
        if (!isAuthPage) {
          console.log('🚫 No auth, redirecting to login');
          history.replace('/auth/login');
          setIsInitialized(true);
          return;
        }
        
        console.log('✅ Auth page access allowed');
      }
      
      setIsInitialized(true);
    };
    
    initializeAuth();
  }, [dispatch, auth.currentUser, location?.pathname]);

  console.log('🔍 AuthWrapper render state:', { isInitialized, hasCurrentUser: !!auth.currentUser });

  // Show loading during initialization
  if (!isInitialized) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>Đang khởi tạo...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default connect(({ auth }: any) => ({
  auth,
}))(AuthWrapper);