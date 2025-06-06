import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Empty } from 'antd';

const CombinationList: React.FC = () => {
  const [data, setData] = useState([
    { key: '1', name: 'A00', description: 'Toán, Lý, Hóa' },
    { key: '2', name: 'D01', description: 'Toán, Văn, Anh' },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCombination, setEditingCombination] = useState<any>(null);

  const handleSave = (values: any) => {
    if (editingCombination) {
      const newData = data.map((item) =>
        item.key === editingCombination.key ? { ...item, ...values } : item
      );
      setData(newData);
      message.success('Cập nhật thành công!');
    } else {
      if (data.some((item) => item.name === values.name)) {
        message.error('Tổ hợp đã tồn tại!');
        return;
      }
      const newCombination = { key: Date.now().toString(), ...values };
      setData([...data, newCombination]);
      message.success('Thêm mới thành công!');
    }
    setIsModalVisible(false);
    setEditingCombination(null);
  };

  const handleDelete = (key: string) => {
    setData(data.filter((item) => item.key !== key));
    message.success('Xóa thành công!');
  };

  return (
    <>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        Thêm tổ hợp
      </Button>
      {data.length > 0 ? (
        <Table
          columns={[
            { title: 'Tên tổ hợp', dataIndex: 'name', key: 'name' },
            { title: 'Mô tả', dataIndex: 'description', key: 'description' },
            {
              title: 'Hành động',
              key: 'action',
              render: (_: any, record: any) => (
                <>
                  <Button type="link" onClick={() => { setEditingCombination(record); setIsModalVisible(true); }}>
                    Sửa
                  </Button>
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa tổ hợp này không?"
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
        title={editingCombination ? 'Chỉnh sửa tổ hợp' : 'Thêm tổ hợp'}
        visible={isModalVisible}
        onCancel={() => { setIsModalVisible(false); setEditingCombination(null); }}
        footer={null}
      >
        <Form
          initialValues={editingCombination || { name: '', description: '' }}
          onFinish={handleSave}
        >
          <Form.Item name="name" label="Tên tổ hợp" rules={[{ required: true, message: 'Vui lòng nhập tên tổ hợp!' }]}>
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

export default CombinationList;