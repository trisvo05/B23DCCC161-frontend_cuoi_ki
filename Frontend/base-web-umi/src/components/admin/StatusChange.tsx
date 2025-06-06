import React, { useState } from 'react';
import { Select, Button, message } from 'antd';

const { Option } = Select;

const StatusChange: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (value: string): void => {
    setStatus(value);
    message.success(`Trạng thái đã được chuyển sang: ${value}`);
  };

  const handleUpdate = (): void => {
    if (!status) {
      message.error('Vui lòng chọn trạng thái trước khi cập nhật!');
      return;
    }
    message.success(`Cập nhật trạng thái thành công: ${status}`);
  };

  return (
    <div>
      <Select
        placeholder="Chọn trạng thái"
        style={{ width: 200, marginRight: 16 }}
        onChange={handleChange}
      >
        <Option value="Chờ duyệt">Chờ duyệt</Option>
        <Option value="Đã duyệt">Đã duyệt</Option>
        <Option value="Từ chối">Từ chối</Option>
      </Select>
      <Button type="primary" onClick={handleUpdate}>
        Cập nhật
      </Button>
    </div>
  );
};

export default StatusChange;