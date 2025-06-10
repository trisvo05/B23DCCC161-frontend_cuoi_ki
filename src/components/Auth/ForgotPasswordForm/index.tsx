// File này tạo form quên mật khẩu và KẾT NỐI với backend NestJS qua auth model

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Result } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { connect, Link, Dispatch } from 'umi';
import type { AuthModelState } from '@/models/auth';
import type { ForgotPasswordRequest } from '@/services/auth/typing';
import styles from './index.less';

const { Title, Text } = Typography;

interface ForgotPasswordFormProps {
  auth: AuthModelState;
  loading: boolean;
  dispatch: Dispatch;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ dispatch, auth, loading }) => {
  const [form] = Form.useForm();
  const [emailSent, setEmailSent] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');

  // Xử lý submit form - GỌI AUTH MODEL để kết nối backend
  const handleSubmit = async (values: ForgotPasswordRequest) => {
    try {
      await dispatch({
        type: 'auth/forgotPassword',
        payload: values,
      });
      
      // Hiển thị success screen
      setEmailAddress(values.email);
      setEmailSent(true);
    } catch (error) {
      console.error('Forgot password form error:', error);
    }
  };

  // Gửi lại email
  const handleResendEmail = async () => {
    if (emailAddress) {
      await dispatch({
        type: 'auth/forgotPassword',
        payload: { email: emailAddress },
      });
    }
  };

  // Hiển thị success screen sau khi gửi email
  if (emailSent) {
    return (
      <div className={styles.forgotPasswordContainer}>
        <Card className={styles.forgotPasswordCard}>
          <Result
            status="success"
            title="Email đã được gửi!"
            subTitle={
              <div>
                <Text>
                  Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến email:
                </Text>
                <br />
                <Text strong>{emailAddress}</Text>
                <br />
                <Text type="secondary">
                  Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
                </Text>
              </div>
            }
            extra={[
              <Button 
                key="resend" 
                onClick={handleResendEmail}
                loading={auth.loading}
              >
                Gửi lại email
              </Button>,
              <Link key="back" to="/auth/login">
                <Button type="primary">
                  Quay lại đăng nhập
                </Button>
              </Link>,
            ]}
          />
        </Card>
      </div>
    );
  }

  // Form quên mật khẩu
  return (
    <div className={styles.forgotPasswordContainer}>
      <Card className={styles.forgotPasswordCard}>
        {/* Header */}
        <div className={styles.header}>
          <Title level={3}>Quên mật khẩu</Title>
          <Text type="secondary">
            Nhập email để nhận hướng dẫn khôi phục mật khẩu
          </Text>
        </div>

        {/* Forgot Password Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          {/* Email */}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Nhập email đã đăng ký"
              autoComplete="username"
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={auth.loading}
              block
            >
              Gửi hướng dẫn khôi phục
            </Button>
          </Form.Item>
        </Form>

        {/* Back to Login */}
        <div className={styles.backToLogin}>
          <Link to="/auth/login">
            <Button type="link" icon={<ArrowLeftOutlined />}>
              Quay lại đăng nhập
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

// Connect với Redux store
export default connect(({ auth, loading }: any) => ({
  auth,
  loading: loading.models.auth,
}))(ForgotPasswordForm);