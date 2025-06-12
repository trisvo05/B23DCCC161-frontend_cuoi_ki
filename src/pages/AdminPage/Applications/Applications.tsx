import React, { useState, useEffect } from 'react';
import { Table, Button, Select, Tag, Modal, Descriptions, Space, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;



const Applications: React.FC = () => {
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('https://b23dccc161-backend-cuoi-ki.onrender.com/applications');
        const formattedData = response.data.map((item: any) => ({
          id: item.id,
          studentName: item.user?.fullName || 'N/A',
          studentId: `HS${item.id.toString().padStart(3, '0')}`,
          school: item.school?.name || 'N/A',
          major: item.major?.name || 'N/A',
          batch: 'Đợt 1', // nếu chưa có trường batch thì hardcode
          status: item.status,
          submittedDate: new Date(item.createdAt).toLocaleDateString(),
          phone: 'Chưa có', // nếu cần thêm trường thì sửa lại API
          email: item.user?.email || 'N/A',
          address: item.personalInfo?.address || 'N/A',
          gpa: item.score || 0,
          documents: item.documents?.map((doc: any) => ({
            name: doc.fileName,
            url: doc.filePath,
          })) || [],
        }));
        setApplications(formattedData);
        // console.log('Dữ liệu hồ sơ:', formattedData);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        message.error('Không thể tải danh sách hồ sơ.');
      }
    };

    fetchApplications();
  }, []);

  const statusColors = {
    pending: 'orange',
    approved: 'green',
    rejected: 'red',
  };

  const statusLabels = {
    pending: 'Chờ duyệt',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
  };

const handleStatusChange = async (applicationId: number, newStatus: string) => {
  try {
    // Gửi yêu cầu cập nhật trạng thái tới backend
    await axios.patch(`https://b23dccc161-backend-cuoi-ki.onrender.com/applications/${applicationId}`, {
      status: newStatus,
    });

    // Nếu thành công thì cập nhật lại state ở frontend
    setApplications(applications.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    ));

    message.success('Cập nhật trạng thái thành công!');
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error);
    message.error('Cập nhật trạng thái thất bại!');
  }
};

  const handleViewDetail = (record: any) => {
    setSelectedApplication(record);
    setIsDetailModalVisible(true);
  };

  const columns = [
    {
      title: 'Mã hồ sơ',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 100,
    },
    {
      title: 'Họ tên',
      dataIndex: 'studentName',
      key: 'studentName',
      width: 150,
    },
    {
      title: 'Trường',
      dataIndex: 'school',
      key: 'school',
      width: 180,
    },
    {
      title: 'Ngành',
      dataIndex: 'major',
      key: 'major',
      width: 150,
    },
    {
      title: 'Đợt',
      dataIndex: 'batch',
      key: 'batch',
      width: 80,
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'submittedDate',
      key: 'submittedDate',
      width: 120,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string, record: any) => (
        <Select
          value={status}
          style={{ width: '100%' }}
          onChange={(value) => handleStatusChange(record.id, value)}
        >
          <Option value="pending"><Tag color={statusColors.pending}>{statusLabels.pending}</Tag></Option>
          <Option value="approved"><Tag color={statusColors.approved}>{statusLabels.approved}</Tag></Option>
          <Option value="rejected"><Tag color={statusColors.rejected}>{statusLabels.rejected}</Tag></Option>
        </Select>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetail(record)}
          >
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: '#1890ff' }}>Quản lý hồ sơ xét tuyển</h1>

      <Table 
        columns={columns} 
        dataSource={applications} 
        rowKey="id"
        bordered
        scroll={{ x: 1200 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} hồ sơ`,
        }}
      />

      <Modal
        title="Chi tiết hồ sơ"
        visible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedApplication && (
          <>
            <Descriptions title="Thông tin cá nhân" bordered column={2}>
              <Descriptions.Item label="Họ tên">{selectedApplication.studentName}</Descriptions.Item>
              <Descriptions.Item label="Mã hồ sơ">{selectedApplication.studentId}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{selectedApplication.phone}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedApplication.email}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>{selectedApplication.address}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="Thông tin học tập" bordered column={2} style={{ marginTop: 16 }}>
              <Descriptions.Item label="Trường">{selectedApplication.school}</Descriptions.Item>
              <Descriptions.Item label="Ngành">{selectedApplication.major}</Descriptions.Item>
              <Descriptions.Item label="Đợt xét tuyển">{selectedApplication.batch}</Descriptions.Item>
              <Descriptions.Item label="Tổng điểm">{selectedApplication.gpa}</Descriptions.Item>
              <Descriptions.Item label="Ngày nộp">{selectedApplication.submittedDate}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="Tài liệu đính kèm" bordered column={1} style={{ marginTop: 16 }}>
              {selectedApplication.documents.map((doc: any, idx: number) => (
                <Descriptions.Item key={idx} label={`Tài liệu ${idx + 1}`}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a>
                </Descriptions.Item>
              ))}
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Applications;
