// src/pages/exception/403/index.tsx

import React from 'react';
import { Result, Button } from 'antd';
import { history } from 'umi';

const ForbiddenPage: React.FC = () => {
  const handleBackHome = () => {
    history.push('/');
  };

  const handleBackLogin = () => {
    history.push('/auth/login');
  };

  return (
    <Result
      status="403"
      title="403"
      subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
      extra={
        <div>
          <Button type="primary" onClick={handleBackHome}>
            Về trang chủ
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleBackLogin}>
            Đăng nhập lại
          </Button>
        </div>
      }
    />
  );
};

export default ForbiddenPage;