import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Empty, Popconfirm } from 'antd';

const MajorList: React.FC = () => {
  const [data, setData] = useState([
    { key: '1', name: 'Ngành Công nghệ thông tin', description: 'CNTT' },
    { key: '2', name: 'Ngành Kinh tế', description: 'Kinh tế học' },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMajor, setEditingMajor] = useState<any>(null);

  const handleSave = (values: any) => {
    if (editingMajor) {
      const newData = data.map((item) =>
        item.key === editingMajor.key ? { ...item, ...values } : item
      );
      setData(newData);
      message.success('Cập nhật thành công!');
    } else {
      if (data.some((item) => item.name === values.name)) {
        message.error('Ngành đã tồn tại!');
        return;
      }
      const newMajor = { key: Date.now().toString(), ...values };
      setData([...data, newMajor]);
      message.success('Thêm mới thành công!');
    }
    setIsModalVisible(false);
    setEditingMajor(null);
  };

  const handleDelete = (key: string) => {
    setData(data.filter((item) => item.key !== key));
    message.success('Xóa thành công!');
  };

  return (
    <>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        Thêm ngành
      </Button>
      {data.length > 0 ? (
        <Table
          columns={[
            { title: 'Tên ngành', dataIndex: 'name', key: 'name' },
            { title: 'Mô tả', dataIndex: 'description', key: 'description' },
            {
              title: 'Hành động',
              key: 'action',
              render: (_: any, record: any) => (
                <>
                  <Button type="link" onClick={() => { setEditingMajor(record); setIsModalVisible(true); }}>
                    Sửa
                  </Button>
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa ngành này không?"
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
          ]}
          dataSource={data}
        />
      ) : (
        <Empty description="Không có dữ liệu" />
      )}
      <Modal
        title={editingMajor ? 'Chỉnh sửa ngành' : 'Thêm ngành'}
        visible={isModalVisible}
        onCancel={() => { setIsModalVisible(false); setEditingMajor(null); }}
        footer={null}
      >
        <Form
          initialValues={editingMajor || { name: '', description: '' }}
          onFinish={handleSave}
        >
          <Form.Item name="name" label="Tên ngành" rules={[{ required: true, message: 'Vui lòng nhập tên ngành!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MajorList;