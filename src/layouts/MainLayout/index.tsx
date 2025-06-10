// src/layouts/MainLayout/index.tsx - TẠO FILE NÀY

import React from 'react';
import { Layout, Button, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { connect, Dispatch } from 'umi';
import type { ConnectProps } from 'umi';
import type { AuthModelState } from '@/models/auth';

const { Header, Content } = Layout;

interface MainLayoutProps extends ConnectProps {
  children: React.ReactNode;
  auth: AuthModelState;
  dispatch: Dispatch;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  auth, 
  dispatch 
}) => {
  
  // Logout handler
  const handleLogout = () => {
    console.log('🚪 Logout clicked');
    dispatch({
      type: 'auth/logout',
    });
  };

  console.log('🎨 MainLayout rendered with user:', auth.currentUser);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header với nút logout */}
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          margin: 0, 
          color: '#1890ff',
          cursor: 'default',
          userSelect: 'none'
        }}>
          🎓 PTIT Admission System
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* User Info */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar icon={<UserOutlined />} style={{ marginRight: '8px' }} />
            <span>{auth.currentUser?.fullName || 'User'}</span>
          </div>
          
          {/* LOGOUT BUTTON - TO LỚN DỄ THẤY */}
          <Button 
            type="primary" 
            danger
            size="large"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ fontSize: '16px', height: '40px' }}
          >
            ĐĂNG XUẤT
          </Button>
        </div>
      </Header>

      {/* Content */}
      <Content style={{ 
        padding: '24px',
        background: '#f0f2f5',
        minHeight: 'calc(100vh - 64px)'
      }}>
        <div style={{ 
          background: '#fff', 
          padding: '24px', 
          borderRadius: '8px',
          minHeight: '100%'
        }}>
          {children}
        </div>
      </Content>
    </Layout>
  );
};

export default connect(({ auth }: any) => ({
  auth,
}))(MainLayout);