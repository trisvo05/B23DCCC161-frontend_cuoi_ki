import React from 'react';
import { Tabs } from 'antd';
import SchoolList from '@/components/admin/SchoolList';
import MajorList from '@/components/admin/MajorList';
import CombinationList from '@/components/admin/CombinationList';
import ApplicationList from '@/components/admin/ApplicationList';
import StatusChange from '@/components/admin/StatusChange';

const { TabPane } = Tabs;

const Dashboard: React.FC = () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Danh sách trường" key="1">
        <SchoolList />
      </TabPane>
      <TabPane tab="Danh sách ngành" key="2">
        <MajorList />
      </TabPane>
      <TabPane tab="Danh sách tổ hợp xét tuyển" key="3">
        <CombinationList />
      </TabPane>
      <TabPane tab="Danh sách hồ sơ" key="4">
        <ApplicationList />
      </TabPane>
      <TabPane tab="Chuyển trạng thái hồ sơ" key="5">
        <StatusChange />
      </TabPane>
    </Tabs>
  );
};

export default Dashboard;