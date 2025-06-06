import React, { useState } from 'react';
import { Table, Button, message, Popconfirm, Empty } from 'antd';

interface School {
  key: string;
  name: string;
  location: string;
}

const SchoolList: React.FC = () => {
  const [data, setData] = useState<School[]>([
    { key: '1', name: 'Trường A', location: 'Hà Nội' },
    { key: '2', name: 'Trường B', location: 'TP.HCM' },
  ]);

  const handleDelete = (key: string): void => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
    message.success('Xóa thành công!');
  };

  const columns = [
    { title: 'Tên trường', dataIndex: 'name', key: 'name' },
    { title: 'Địa điểm', dataIndex: 'location', key: 'location' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: School) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa trường này không?"
          onConfirm={() => handleDelete(record.key)}
          okText="Có"
          cancelText="Không"
        >
          <Button danger>Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  return data.length > 0 ? (
    <Table columns={columns} dataSource={data} />
  ) : (
    <Empty description="Không có dữ liệu" />
  );
};

export default SchoolList;