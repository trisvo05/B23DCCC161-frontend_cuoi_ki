import React from 'react';
import Statistics from '@/components/admin/Statistics';

const StatisticsPage: React.FC = () => {
  return (
    <div>
      <h2>Thống kê hồ sơ</h2>
      <Statistics
        totalApplications={120}
        approvedApplications={80}
        pendingApplications={30}
        rejectedApplications={10}
      />
    </div>
  );
};

export default StatisticsPage;