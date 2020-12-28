import Home from '../views/Home'
import Dashbord from '../views/Dashbord/Dashbord'

/**
 * hidden： 是否为blank页面
 * notLogin：是否需要登录
 */
export default [
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: Login,
  //   hidden: true,
  //   meta: { title: '登录', notLogin: true },
  // },
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: '/dashbord',
    hidden: false,
    meta: {},
    children: [
      {
        path: '/dashbord',
        name: 'dashbord',
        component: Dashbord,
        meta: { title: '首页' },
      },
      {
        path: 'tag',
        name: 'tag',
        component: () => import('../views/Tag/Tag'),
        meta: { title: '标签' },
      },
      {
        path: '/table',
        name: 'table',
        component: () => import('../views/Table/Index.vue'),
        redirect: '/table/list',
        meta: { title: '表格' },
        children: [
          {
            path: '/table/list',
            name: 'tablelist',
            component: () => import('../views/Table/List.vue'),
            meta: { title: '简单表格' },
          },
          {
            path: '/table/complex',
            name: 'tablecomplex',
            component: () => import('../views/Table/Complex.vue'),
            meta: { title: '复杂表格' },
            children: [
              {
                path: '/table/complex/addupdate',
                name: 'complexaddupdate',
                component: () => import('../views/Table/AddUpdate.vue'),
                meta: { title: '新增编辑' },
              },
            ],
          },
        ],
      },
      {
        path: '/about',
        name: 'about',
        meta: { title: '关于我们' },
        component: () => import('../views/About/About.vue'),
        children: [
          {
            path: '/about/add',
            name: 'aboutAdd',
            hidden: true,
            component: () => import('../views/About/Add.vue'),
            meta: { title: '创建' },
          },
        ],
      },
    ],
  },
]
