﻿export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	// {
	// 	path: '/dashboard',
	// 	name: 'Dashboard',
	// 	component: './TrangChu',
	// 	icon: 'HomeOutlined',
	// },
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/trangchu',
		name: 'Trang chủ',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/gioithieugioithieu',
		name: 'Giới thiệu',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/admission',
		name: 'User Page',
		icon: 'FormOutlined',
		routes: [
			{
				path: '/admission/application',
				name: 'Đăng ký xét tuyển',
				component: './Admission/Application',
			},
			{
				path: '/admission/status',
				name: 'Theo dõi hồ sơ',
				component: './Admission/Status',
			}
		],
	},
	{
		path: '/admin',
		name: 'Admin Page',
		icon: 'FormOutlined',
		routes: [
			{
				path: '/admin/dashboard',
				name: 'Dashboard',
				component: './AdminPage/Dashboard/Dashboard',
			},
			{
				path: '/admin/management',
				name: 'Quản lý chung ',
				component: './AdminPage/Management/Management',
			},
			{
				path: '/admin/applications',
				name: 'Quản lý hồ sơ ',
				component: './AdminPage/Applications/Applications',
			},

		],
	},
	


	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
