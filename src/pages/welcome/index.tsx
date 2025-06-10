// src/pages/welcome/index.tsx

import React, { useEffect } from 'react';
import { Button, Typography, Row, Col } from 'antd';
import { history } from 'umi';
import { getToken, getUserInfo } from '@/utils/auth';

const { Title, Paragraph } = Typography;

const WelcomePage: React.FC = () => {
  
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

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '48px', 
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <Title level={1} style={{ color: '#1890ff', marginBottom: '24px' }}>
          🎓 PTIT Admission System
        </Title>
        
        <Paragraph style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
          Hệ thống xét tuyển trực tuyến Học viện Công nghệ Bưu chính Viễn thông
        </Paragraph>

        <Row gutter={16}>
          <Col span={12}>
            <Button 
              type="primary" 
              size="large" 
              block
              onClick={() => history.push('/auth/login')}
            >
              Đăng nhập
            </Button>
          </Col>
          <Col span={12}>
            <Button 
              size="large" 
              block
              onClick={() => history.push('/auth/register')}
            >
              Đăng ký
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default WelcomePage;