import React, { useEffect, useState } from 'react';
import {
  Tabs,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { TabPane } = Tabs;

const Management: React.FC = () => {
  const [activeTab, setActiveTab] = useState('schools');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [schools, setSchools] = useState<any[]>([]);
  const [majors, setMajors] = useState<any[]>([]);
  const [subjectGroups, setSubjectGroups] = useState<any[]>([]);

  const API_MAP: any = {
    schools: 'https://b23dccc161-backend-cuoi-ki.onrender.com/schools',
    majors: 'https://b23dccc161-backend-cuoi-ki.onrender.com/majors',
    subjectGroups: 'https://b23dccc161-backend-cuoi-ki.onrender.com/subjectcombinations',
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_MAP[activeTab]);
      if (activeTab === 'schools') setSchools(res.data);
      else if (activeTab === 'majors') setMajors(res.data);
      else if (activeTab === 'subjectGroups') setSubjectGroups(res.data);
    } catch (error) {
      console.error(error);
      message.error('Không thể tải dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleAdd = () => {
    setModalType('add');
    setCurrentRecord(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (record: any) => {
    setModalType('edit');
    setCurrentRecord(record);
    setIsModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_MAP[activeTab]}/${id}`);
      message.success('Xoá thành công!');
      fetchData();
    } catch (error) {
      console.error(error);
      message.error('Xoá thất bại!');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (modalType === 'add') {
        await axios.post(API_MAP[activeTab], values);
        message.success('Thêm mới thành công!');
      } else {
        await axios.put(`${API_MAP[activeTab]}/${currentRecord.id}`, values);
        message.success('Cập nhật thành công!');
      }
      setIsModalVisible(false);
      fetchData();
    } catch (error) {
      console.error(error);
      message.error('Lỗi xử lý dữ liệu!');
    }
  };

  const renderColumns = () => {
    switch (activeTab) {
      case 'schools':
        return [
          { title: 'Tên trường', dataIndex: 'name', key: 'name' },
          { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
          actionColumn(),
        ];
      case 'majors':
        return [
          { title: 'Tên ngành', dataIndex: 'name', key: 'name' },
          { title: 'Thuộc trường', dataIndex: 'school', key: 'schools' ,render: (_: any, record: any) => record.school?.name,},
          {
            title: 'Các tổ hợp môn',
            key: 'major_combination',
            render: (_: any, record: any) =>
              record.combinations?.map((c: any) => c.combination?.code).join(', ') || 'Không có',
          } ,

          actionColumn(),
        ];
      case 'subjectGroups':
        return [
          { title: 'Mã tổ hợp', dataIndex: 'code', key: 'code' },
          { title: 'Tên tổ hợp', dataIndex: 'subjects', key: 'subjects' },
          actionColumn(),
        ];
      default:
        return [];
    }
  };

  const actionColumn = () => ({
    title: 'Thao tác',
    key: 'action',
    render: (_: any, record: any) => (
      <Space>
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          Sửa
        </Button>
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDelete(record.id)}
          okText="Có"
          cancelText="Không"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>
      </Space>
    ),
  });

  const renderFormFields = () => {
    switch (activeTab) {
      case 'schools':
        return (
          <>
            <Form.Item
              name="name"
              label="Tên trường"
              rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            >
              <Input />
            </Form.Item>
          </>
        );
      case 'majors':
        return (
          <>
            <Form.Item
              name="name"
              label="Tên ngành"
              rules={[{ required: true, message: 'Vui lòng nhập tên ngành!' }]}
            >
              <Input />
            </Form.Item>
            {/* <Form.Item name="description" label="Mô tả">
              <Input.TextArea />
            </Form.Item> */}
          </>
        );
      case 'subjectGroups':
        return (
          <>
            <Form.Item
              name="code"
              label="Mã tổ hợp"
              rules={[{ required: true, message: 'Vui lòng nhập mã tổ hợp!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="name"
              label="Tên tổ hợp"
              rules={[{ required: true, message: 'Vui lòng nhập tên tổ hợp!' }]}
            >
              <Input />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'schools': return 'Trường';
      case 'majors': return 'Ngành';
      case 'subjectGroups': return 'Tổ hợp môn';
      default: return '';
    }
  };

  const getDataSource = () => {
    switch (activeTab) {
      case 'schools': return schools;
      case 'majors': return majors;
      case 'subjectGroups': return subjectGroups;
      default: return [];
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: '#1890ff' }}>Quản lý dữ liệu</h1>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Trường" key="schools" />
        <TabPane tab="Ngành" key="majors" />
        <TabPane tab="Tổ hợp môn" key="subjectGroups" />
      </Tabs>

      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm {getTitle()}
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          dataSource={getDataSource()}
          columns={renderColumns()}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Spin>

      <Modal
        title={modalType === 'add' ? `Thêm ${getTitle()}` : `Sửa ${getTitle()}`}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          {renderFormFields()}
        </Form>
      </Modal>
    </div>
  );
};

export default Management;