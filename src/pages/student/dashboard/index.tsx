// src/pages/student/dashboard/index.tsx - THÊM LOGOUT BUTTON NGAY VÀO DASHBOARD

import React, { useEffect } from 'react';
import { Card, Typography, Row, Col, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import { getToken, getUserInfo } from '@/utils/auth';
import type { AuthModelState } from '@/models/auth';

const { Title, Paragraph } = Typography;

interface StudentDashboardProps {
  auth: AuthModelState;
  dispatch: any;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ auth, dispatch }) => {
  
  useEffect(() => {
    const token = getToken();
    const user = getUserInfo();
    
    if (!token || !user) {
      history.replace('/auth/login');
      return;
    }
    
    if (user.role !== 'student') {
      history.replace('/403');
      return;
    }
    
    if (!auth.currentUser) {
      dispatch({
        type: 'auth/setCurrentUser',
        payload: user,
      });
    }
  }, []);

  // LOGOUT HANDLER
  const handleLogout = () => {
    console.log('🚪 Logout clicked from dashboard');
    dispatch({
      type: 'auth/logout',
    });
  };

  const user = getUserInfo();
  
  if (!user || user.role !== 'student') {
    return null;
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* HEADER VỚI LOGOUT BUTTON */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px',
        padding: '16px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Dashboard Thí sinh</Title>
          <Paragraph style={{ margin: 0 }}>Chào mừng {user.fullName}! 🎓</Paragraph>
        </div>
        
        {/* TO LỚN, MÀU ĐỎ, DỄ THẤY */}
        <Button 
          type="primary" 
          danger
          size="large"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ 
            fontSize: '16px', 
            height: '50px',
            minWidth: '150px'
          }}
        >
          ĐĂNG XUẤT
        </Button>
      </div>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Title level={3}>Thông tin cá nhân</Title>
            <p>Email: {user.email}</p>
            <p>Họ tên: {user.fullName}</p>
            <p>Vai trò: {user.role}</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ auth }: any) => ({
  auth,
}))(StudentDashboard);