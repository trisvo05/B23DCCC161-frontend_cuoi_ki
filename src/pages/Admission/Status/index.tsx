import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Tag, Button, Space, Empty, Modal, Descriptions, Badge } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';

interface ApplicationRecord {
  fullName?: string;
  dob: string;
  address: string;
  score: number;
  priorityObject: string;
  status: 'pending' | 'approved' | 'rejected';
}

const StatusPage: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationRecord | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:3000/applications');
        const data = response.data;

        // Lọc dữ liệu, bỏ qua id, createdAt, updatedAt
        const filteredData: ApplicationRecord[] = data.map((app: any) => ({
          fullName: app.user?.fullName,
          dob: app.personalInfo?.dob,
          address: app.personalInfo?.address,
          score: app.score,
          priorityObject: app.priorityObject,
          status: app.status,
        }));

        setApplications(filteredData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
      }
    };

    fetchApplications();
  }, []);

  const showDetailModal = (record: ApplicationRecord) => {
    setSelectedApplication(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text: string) => text || 'Chưa có thông tin',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      key: 'dob',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Điểm xét tuyển',
      dataIndex: 'score',
      key: 'score',
    },
    {
      title: 'Đối tượng ưu tiên',
      dataIndex: 'priorityObject',
      key: 'priorityObject',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let text = '';

        if (status === 'pending') {
          color = 'gold';
          text = 'Chờ duyệt';
        } else if (status === 'approved') {
          color = 'green';
          text = 'Đã duyệt';
        } else if (status === 'rejected') {
          color = 'red';
          text = 'Từ chối';
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: ApplicationRecord) => (
        <Space size="middle">
          <Button type="link" onClick={() => showDetailModal(record)}>Xem chi tiết</Button>
        </Space>
      ),
    },
  ];

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge status="processing" text="Đang chờ duyệt" />;
      case 'approved':
        return <Badge status="success" text="Đã duyệt" />;
      case 'rejected':
        return <Badge status="error" text="Từ chối" />;
      default:
        return <Badge status="default" text="Không xác định" />;
    }
  };

  return (
    <PageContainer title="Theo dõi trạng thái hồ sơ">
      {applications.length > 0 ? (
        <Table 
          columns={columns} 
          dataSource={applications} 
          rowKey={(_, index) => (index !== undefined ? index.toString() : Math.random().toString())} // dùng index làm key vì không có id
        />
      ) : (
        <Empty description="Chưa có hồ sơ nào được nộp" />
      )}

      <Modal
        title="Chi tiết hồ sơ xét tuyển"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {selectedApplication && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Họ và tên">{selectedApplication.fullName || 'Chưa có thông tin'}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">{selectedApplication.dob}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{selectedApplication.address}</Descriptions.Item>
            <Descriptions.Item label="Điểm xét tuyển">{selectedApplication.score}</Descriptions.Item>
            <Descriptions.Item label="Đối tượng ưu tiên">{selectedApplication.priorityObject}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{getStatusDisplay(selectedApplication.status)}</Descriptions.Item>
            <Descriptions.Item label="Ghi chú">
              {selectedApplication.status === 'pending' ? 'Hồ sơ của bạn đang được xét duyệt, vui lòng chờ kết quả.' :
               selectedApplication.status === 'approved' ? 'Chúc mừng! Hồ sơ của bạn đã được chấp nhận.' :
               selectedApplication.status === 'rejected' ? 'Rất tiếc, hồ sơ của bạn không được chấp nhận.' : ''}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </PageContainer>
  );
};

export default StatusPage;
