// config/routes.ts - KIỂM TRA LAYOUT

export default [
  {
    path: '/welcome',
    layout: false,
    component: './welcome',
  },
  {
    path: '/',
    redirect: '/welcome',
    exact: true,
  },
  {
    path: '/auth',
    layout: false,
    routes: [
      {
        path: '/auth/login',
        component: './auth/login',
      },
      {
        path: '/auth/register',
        component: './auth/register',
      },
    ],
  },
  
  // ✅ QUAN TRỌNG: Phải có layout cho admin/student
  {
    path: '/admin',
    layout: '@/layouts/MainLayout', // ✅ PHẢI CÓ DÒNG NÀY
    routes: [
      {
        path: '/admin/dashboard',
        component: './admin/dashboard',
      },
    ],
  },
  {
    path: '/student',
    layout: '@/layouts/MainLayout', // ✅ PHẢI CÓ DÒNG NÀY
    routes: [
      {
        path: '/student/dashboard',
        component: './student/dashboard',
      },
    ],
  },
  
  {
    path: '/403',
    layout: false,
    component: './exception/403',
  },
  {
    path: '*',
    layout: false,
    component: './exception/404',
  },
];