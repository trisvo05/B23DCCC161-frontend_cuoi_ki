import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { UserOutlined, BookOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
  Legend,
} from 'recharts';
import axios from 'axios';
// import { response } from 'express';
const COLORS = ['#FFBB28', '#00C49F', '#FF8042'];
const Dashboard: React.FC = () => {
	// Mock data for statistics
	const applicationsBySchool = [
		{ name: 'ĐH Bách Khoa HN', value: 1250 },
		{ name: 'ĐH Kinh tế Quốc dân', value: 980 },
		{ name: 'ĐH Ngoại thương', value: 756 },
		{ name: 'ĐH Y Hà Nội', value: 642 },
		{ name: 'ĐH Luật HN', value: 534 },
	];

	//  get data stats
	
	const [dataStats, setDataStats] = useState<DataStats>({});
  
  const [data, setData] = useState<StatusData[]>([]);
	useEffect(() => {
		axios
			.get('https://b23dccc161-backend-cuoi-ki.onrender.com/admin/stats')
			.then((response: any) => {
        const stats = response.data;
				setDataStats(stats), console.log(stats);
        
        const formattedData = [
          { name: 'Chờ duyệt', value: stats.pending },
          { name: 'Đã duyệt', value: stats.approved },
          { name: 'Từ chối', value: stats.rejected },
        ];
        setData(formattedData);

			})
			.catch((error: any) => console.log(error));
	}, []);

	return (
		<div>
			<h1 style={{ marginBottom: 24, color: '#1890ff' }}>Dashboard - Thống kê tổng quan</h1>

			{/* Statistics Cards */}
			<Row gutter={16} style={{ marginBottom: 24 }}>
				<Col span={6}>
					<Card>
						<Statistic
							title='Tổng hồ sơ'
							value={dataStats.totalApplications || 0}
							prefix={<FileTextOutlined />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Chờ duyệt'
							value={dataStats.pending }
							prefix={<UserOutlined />}
							valueStyle={{ color: '#faad14' }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Đã duyệt'
							value={dataStats.approved}
							prefix={<CheckCircleOutlined />}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title='Số ngành' value={dataStats.majorStats} prefix={<BookOutlined />} valueStyle={{ color: '#722ed1' }} />
					</Card>
				</Col>
			</Row>

			{/* Charts */}
			<Row gutter={16} style={{ marginBottom: 24 }}>
				<Col span={14}>
					<Card title='Hồ sơ theo trường'>
						<ResponsiveContainer width='100%' height={300}>
							<BarChart data={applicationsBySchool}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='name' angle={-45} textAnchor='end' height={80} />
								<YAxis />
								<Tooltip />
								<Bar dataKey='value' fill='#1890ff' />
							</BarChart>
						</ResponsiveContainer>
					</Card>
				</Col>
				<Col span={10}>
					<Card title='Trạng thái hồ sơ'>
						<ResponsiveContainer width='100%' height={300}>
							<PieChart width={400} height={300}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  label
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
						</ResponsiveContainer>
					</Card>
				</Col>
			</Row>

	
			{/* <Card title='Thống kê theo ngành'>
				<Table columns={columns} dataSource={majorStats} rowKey='major' pagination={false} />
			</Card> */}
		</div>
	);
};

export default Dashboard;