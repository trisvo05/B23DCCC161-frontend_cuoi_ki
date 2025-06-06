import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom'; // Sửa import từ 'umi' thành 'react-router-dom'

const { Header, Content, Sider } = Layout;

interface BasicLayoutProps {
  children: React.ReactNode;
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div className="logo" style={{ color: 'white', textAlign: 'center', padding: '16px' }}>
          Admin Panel
        </div>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1">
            <Link to="/dashboard">Danh sách</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/statistics">Thống kê</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} />
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;