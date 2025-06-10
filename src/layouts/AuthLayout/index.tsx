

import React from 'react';
import { ConfigProvider } from 'antd';
import styles from './index.less';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <ConfigProvider>
      <div className={styles.authLayout}>
        {/* Background */}
        <div className={styles.background} />
        
        {/* Content */}
        <div className={styles.content}>
          {children}
        </div>
        
        {/* Footer */}
        <div className={styles.footer}>
          <p>&copy; 2024 - Hệ thống xét tuyển trực tuyến</p>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default AuthLayout;