// File này tạo form đăng nhập và KẾT NỐI với backend NestJS qua auth model

import React from 'react';
import { Form, Input, Button, Card, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { connect, Link, history, Dispatch } from 'umi';
import type { AuthModelState } from '@/models/auth';
import styles from './index.less';

const { Title, Text } = Typography;

interface LoginFormProps {
  auth: AuthModelState;
  loading: boolean;
  dispatch: Dispatch;
}

const LoginForm: React.FC<LoginFormProps> = ({ dispatch, auth, loading }) => {
  const [form] = Form.useForm();

  // Xử lý submit form - GỌI AUTH MODEL để kết nối backend
  const handleSubmit = async (values: any) => {
    try {
      // Backend expect username field, không phải identifier
      const loginData = {
        username: values.identifier, // Gửi identifier với tên field là username
        password: values.password,
      };

      await dispatch({
        type: 'auth/login',
        payload: loginData,
      });
    } catch (error) {
      console.error('Login form error:', error);
    }
  };

  const handleForgotPassword = () => {
    history.push('/auth/forgot-password');
  };

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.loginCard}>
        {/* Header */}
        <div className={styles.header}>
          <Title level={3}>Đăng nhập</Title>
          <Text type="secondary">
            Đăng nhập vào hệ thống xét tuyển trực tuyến
          </Text>
        </div>

        {/* Login Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          {/* Username */}
          <Form.Item
            name="identifier"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nhập tên đăng nhập"
              autoComplete="username"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
            />
          </Form.Item>

          {/* Forgot Password */}
          <div className={styles.forgotPassword}>
            <Button 
              type="link" 
              size="small"
              onClick={handleForgotPassword}
            >
              Quên mật khẩu?
            </Button>
          </div>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={auth.loginLoading}
              block
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Divider>hoặc</Divider>

        {/* Register Link */}
        <div className={styles.registerLink}>
          <Text>Chưa có tài khoản? </Text>
          <Link to="/auth/register">
            <Button type="link" size="small">
              Đăng ký ngay
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default connect(({ auth, loading }: any) => ({
  auth,
  loading: loading.models.auth,
}))(LoginForm);