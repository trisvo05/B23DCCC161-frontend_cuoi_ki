// File này tạo admin dashboard - giao diện đơn giản không cần API phức tạp

import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Result } from 'antd';
import { connect, history, Dispatch } from 'umi';
import type { ConnectProps } from 'umi';
import type { AuthModelState } from '@/models/auth';

const { Title, Paragraph } = Typography;

interface AdminDashboardProps extends ConnectProps {
  auth: AuthModelState;
  dispatch: Dispatch;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  dispatch, 
  auth
}) => {
  const [mounted, setMounted] = useState(true);
  
  useEffect(() => {
    if (!auth.currentUser) {
      history.push('/auth/login');
      return;
    }
    
    if (auth.currentUser.role !== 'admin') {
      history.push('/403');
      return;
    }
    
    return () => {
      setMounted(false);
    };
  }, [auth.currentUser]);

  if (!auth.currentUser) {
    return null;
  }
  
  if (auth.currentUser.role !== 'admin') {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Bạn không có quyền truy cập trang này."
        extra={
          <a href="/auth/login">Quay lại đăng nhập</a>
        }
      />
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>Dashboard Admin</Title>
        <Paragraph>Chào mừng quản trị viên {auth.currentUser.fullName}</Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Title level={3}>
              Chào mừng, {auth.currentUser.fullName}! 👋
            </Title>
            <Paragraph>
              Đây là trang dashboard dành cho quản trị viên hệ thống xét tuyển PTIT.
            </Paragraph>
            <Paragraph type="secondary">
              Email: {auth.currentUser.email}
            </Paragraph>
            <Paragraph type="secondary">
              Role: {auth.currentUser.role}
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card title="Thống kê tổng quan" bordered>
            <p>Dữ liệu thống kê sẽ được hiển thị ở đây...</p>
            <p>Tổng thí sinh: 0</p>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card title="Quản lý người dùng" bordered>
            <p>Danh sách người dùng sẽ được hiển thị ở đây...</p>
            <p>Người dùng hoạt động: 0</p>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card title="Báo cáo hệ thống" bordered>
            <p>Báo cáo hệ thống sẽ được hiển thị ở đây...</p>
            <p>Trạng thái: Hoạt động bình thường</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ auth }: any) => ({
  auth,
}))(AdminDashboard);