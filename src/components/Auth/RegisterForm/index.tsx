// File này tạo form đăng ký và KẾT NỐI với backend NestJS qua auth model

import React from 'react';
import { Form, Input, Button, Card, Typography, Divider, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { connect, Link, Dispatch } from 'umi';
import type { AuthModelState } from '@/models/auth';
import type { RegisterRequest } from '@/services/auth/typing';
import styles from './index.less';

const { Title, Text } = Typography;
const { Option } = Select;

interface RegisterFormProps {
	auth: AuthModelState;
	loading: boolean;
	dispatch: Dispatch;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ dispatch, auth, loading }) => {
	const [form] = Form.useForm();

	// Xử lý submit form - GỌI AUTH MODEL để kết nối backend
	const handleSubmit = async (values: Omit<RegisterRequest, 'username'>) => {
		try {
			// Auto generate username từ email
			const username = values.email.split('@')[0];

			await dispatch({
				type: 'auth/register',
				payload: {
					...values,
					username, // Thêm username tự động
				},
			});
		} catch (error) {
			console.error('Register form error:', error);
		}
	};

	// ...rest of component code...
	return (
		<div className={styles.registerContainer}>
			<Card className={styles.registerCard}>
				{/* Header */}
				<div className={styles.header}>
					<Title level={3}>Đăng ký tài khoản</Title>
					<Text type='secondary'>Tạo tài khoản để tham gia xét tuyển</Text>
				</div>

				{/* Register Form */}
				<Form form={form} layout='vertical' onFinish={handleSubmit} autoComplete='off' size='large'>
					{/* Full Name */}
					<Form.Item
						name='fullName'
						label='Họ và tên'
						rules={[
							{ required: true, message: 'Vui lòng nhập họ và tên!' },
							{ min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' },
						]}
					>
						<Input prefix={<UserOutlined />} placeholder='Nhập họ và tên đầy đủ' />
					</Form.Item>

					{/* Email */}
					<Form.Item
						name='email'
						label='Email'
						rules={[
							{ required: true, message: 'Vui lòng nhập email!' },
							{ type: 'email', message: 'Email không hợp lệ!' },
						]}
					>
						<Input prefix={<MailOutlined />} placeholder='Nhập địa chỉ email' autoComplete='username' />
					</Form.Item>

					{/* Phone */}
					<Form.Item
						name='phone'
						label='Số điện thoại'
						rules={[{ pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }]}
					>
						<Input prefix={<PhoneOutlined />} placeholder='Nhập số điện thoại (không bắt buộc)' />
					</Form.Item>

					{/* Role */}
					<Form.Item
						name='role'
						label='Loại tài khoản'
						rules={[{ required: true, message: 'Vui lòng chọn loại tài khoản!' }]}
					>
						<Select placeholder='Chọn loại tài khoản'>
							<Option value='student'>Thí sinh</Option>
							<Option value='admin'>Quản trị viên</Option>
						</Select>
					</Form.Item>

					{/* Password */}
					<Form.Item
						name='password'
						label='Mật khẩu'
						rules={[
							{ required: true, message: 'Vui lòng nhập mật khẩu!' },
							{ min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
						]}
					>
						<Input.Password prefix={<LockOutlined />} placeholder='Nhập mật khẩu' autoComplete='new-password' />
					</Form.Item>

					{/* Confirm Password */}
					<Form.Item
						name='confirmPassword'
						label='Xác nhận mật khẩu'
						dependencies={['password']}
						rules={[
							{ required: true, message: 'Vui lòng xác nhận mật khẩu!' },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue('password') === value) {
										return Promise.resolve();
									}
									return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
								},
							}),
						]}
					>
						<Input.Password prefix={<LockOutlined />} placeholder='Nhập lại mật khẩu' autoComplete='new-password' />
					</Form.Item>

					{/* Submit Button */}
					<Form.Item>
						<Button type='primary' htmlType='submit' loading={auth.registerLoading} block>
							Đăng ký tài khoản
						</Button>
					</Form.Item>
				</Form>

				<Divider>hoặc</Divider>

				{/* Login Link */}
				<div className={styles.loginLink}>
					<Text>Đã có tài khoản? </Text>
					<Link to='/auth/login'>
						<Button type='link' size='small'>
							Đăng nhập ngay
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
}))(RegisterForm);
