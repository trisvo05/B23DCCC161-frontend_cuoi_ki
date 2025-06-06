import React from 'react';
import { Descriptions, Statistic, Row, Col } from 'antd';

interface StatisticsProps {
  totalApplications: number;
  approvedApplications: number;
  pendingApplications: number;
  rejectedApplications: number;
}

const Statistics: React.FC<StatisticsProps> = ({
  totalApplications,
  approvedApplications,
  pendingApplications,
  rejectedApplications,
}) => {
  return (
    <div>
      <Descriptions title="Thống kê hồ sơ" bordered column={1} style={{ marginBottom: 20 }}>
        <Descriptions.Item label="Tổng số hồ sơ">{totalApplications}</Descriptions.Item>
        <Descriptions.Item label="Hồ sơ đã duyệt">{approvedApplications}</Descriptions.Item>
        <Descriptions.Item label="Hồ sơ chờ duyệt">{pendingApplications}</Descriptions.Item>
        <Descriptions.Item label="Hồ sơ bị từ chối">{rejectedApplications}</Descriptions.Item>
      </Descriptions>
      <Row gutter={16}>
        <Col span={12}>
          <Statistic title="Hồ sơ theo trường" value={50} />
        </Col>
        <Col span={12}>
          <Statistic title="Hồ sơ theo ngành" value={70} />
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;