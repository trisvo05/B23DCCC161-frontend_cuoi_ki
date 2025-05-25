import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Empty, Modal, Descriptions, Badge } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';

interface ApplicationRecord {
  id: number;
  school: string;
  major: string;
  fullName?: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

const StatusPage: React.FC = () => {
  // Khởi tạo state để lưu danh sách hồ sơ, mặc định là rỗng
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  // State để quản lý modal hiển thị chi tiết
  const [isModalVisible, setIsModalVisible] = useState(false);
  // State để lưu hồ sơ đang xem chi tiết
  const [selectedApplication, setSelectedApplication] = useState<ApplicationRecord | null>(null);

  // Đọc dữ liệu từ localStorage khi component được tạo
  useEffect(() => {
    try {
      const storedData = localStorage.getItem('admissionApplications');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Chỉ sử dụng dữ liệu từ localStorage nếu có
        setApplications(parsedData.sort((a: ApplicationRecord, b: ApplicationRecord) => a.id - b.id));
      } else {
        // Nếu không có dữ liệu từ localStorage và không có dữ liệu mẫu, hiển thị giao diện trống
        setApplications([]);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }, []);

  // Hiển thị modal chi tiết khi click vào nút Xem chi tiết
  const showDetailModal = (record: ApplicationRecord) => {
    setSelectedApplication(record);
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: ApplicationRecord, b: ApplicationRecord) => a.id - b.id,
      defaultSortOrder: 'ascend' as 'ascend',
    },
    {
      title: 'Trường',
      dataIndex: 'school',
      key: 'school',
    },
    {
      title: 'Ngành',
      dataIndex: 'major',
      key: 'major',
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'submissionDate',
      key: 'submissionDate',
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

  // Chuyển đổi trạng thái thành tên thân thiện hơn
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
          rowKey="id"
        />
      ) : (
        <Empty description="Chưa có hồ sơ nào được nộp" />
      )}

      {/* Modal hiển thị chi tiết hồ sơ */}
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
            <Descriptions.Item label="ID hồ sơ">{selectedApplication.id}</Descriptions.Item>
            <Descriptions.Item label="Họ và tên">{selectedApplication.fullName || 'Chưa có thông tin'}</Descriptions.Item>
            <Descriptions.Item label="Trường đăng ký">{selectedApplication.school}</Descriptions.Item>
            <Descriptions.Item label="Ngành đăng ký">{selectedApplication.major}</Descriptions.Item>
            <Descriptions.Item label="Ngày nộp hồ sơ">{selectedApplication.submissionDate}</Descriptions.Item>
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