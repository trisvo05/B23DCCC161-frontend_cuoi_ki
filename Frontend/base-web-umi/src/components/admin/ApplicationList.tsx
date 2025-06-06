import React, { useState } from 'react';
import { Table, Button, Tag, Popconfirm, message } from 'antd';

const ApplicationList: React.FC = () => {
  const [data, setData] = useState([
    { key: '1', name: 'Nguyễn Văn A', school: 'Trường A', major: 'CNTT', status: 'Chờ duyệt' },
    { key: '2', name: 'Trần Thị B', school: 'Trường B', major: 'Kinh tế', status: 'Đã duyệt' },
  ]);

  const handleDelete = (key: string) => {
    setData(data.filter((item) => item.key !== key));
    message.success('Xóa hồ sơ thành công!');
  };

  const columns = [
    { title: 'Tên hồ sơ', dataIndex: 'name', key: 'name' },
    { title: 'Trường', dataIndex: 'school', key: 'school' },
    { title: 'Ngành', dataIndex: 'major', key: 'major' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = status === 'Đã duyệt' ? 'green' : status === 'Chờ duyệt' ? 'blue' : 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <>
          <Button type="link">Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa hồ sơ này không?"
            onConfirm={() => handleDelete(record.key)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};

export default ApplicationList;