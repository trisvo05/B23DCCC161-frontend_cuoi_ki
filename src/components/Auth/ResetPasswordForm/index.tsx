// File này tạo form reset mật khẩu và KẾT NỐI với backend NestJS qua auth model

import React, { useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { connect, history, Dispatch } from 'umi';
import type { AuthModelState } from '@/models/auth';
import type { ResetPasswordRequest } from '@/services/auth/typing';
import styles from './index.less';

const { Title, Text } = Typography;

interface ResetPasswordFormProps {
  auth: AuthModelState;
  loading: boolean;
  dispatch: Dispatch;
  location?: {
    query?: {
      token?: string;
    };
  };
  history?: any;
  match?: any;
  route?: any;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ 
  dispatch, 
  auth, 
  loading, 
  location 
}) => {
  const [form] = Form.useForm();
  const token = location?.query?.token;

  // Kiểm tra có token không
  useEffect(() => {
    if (!token) {
      history.push('/auth/login');
    }
  }, [token]);

  // Xử lý submit form - GỌI AUTH MODEL để kết nối backend
  const handleSubmit = async (values: Omit<ResetPasswordRequest, 'token'>) => {
    if (!token) return;

    try {
      await dispatch({
        type: 'auth/resetPassword',
        payload: {
          ...values,
          token,
        },
      });
      // Auth model sẽ redirect về login sau khi reset thành công
    } catch (error) {
      console.error('Reset password form error:', error);
    }
  };

  if (!token) {
    return (
      <div className={styles.resetPasswordContainer}>
        <Card className={styles.resetPasswordCard}>
          <Alert
            message="Link không hợp lệ"
            description="Link khôi phục mật khẩu không hợp lệ hoặc đã hết hạn."
            type="error"
            showIcon
          />
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.resetPasswordContainer}>
      <Card className={styles.resetPasswordCard}>
        {/* Header */}
        <div className={styles.header}>
          <Title level={3}>Đặt lại mật khẩu</Title>
          <Text type="secondary">
            Nhập mật khẩu mới cho tài khoản của bạn
          </Text>
        </div>

        {/* Reset Password Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          {/* New Password */}
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu mới"
              autoComplete="new-password"
            />
          </Form.Item>

          {/* Confirm Password */}
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập lại mật khẩu mới"
              autoComplete="new-password"
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
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

// Connect với Redux store
export default connect(({ auth, loading }: any) => ({
  auth,
  loading: loading.models.auth,
}))(ResetPasswordForm);