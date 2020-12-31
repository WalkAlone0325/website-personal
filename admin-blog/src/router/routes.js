import Home from '../views/Home'
import Dashbord from '../views/Dashbord/Dashbord'
import BlankLayout from '../layout/BlankLayout'
import Login from '../views/Login/Login'

/**
 * hidden： 是否为blank页面
 * notLogin：是否需要登录
 */
export default [
  {
    path: '/login',
    name: 'login',
    component: Login,
    hidden: true,
    meta: { title: '登录', notLogin: true },
  },
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
        meta: { title: '首页', icon: 'el-icon-menu' },
      },
      {
        path: '/tag',
        name: 'tag',
        component: () => import('../views/Tag/Tag'),
        meta: { title: '标签管理', icon: 'el-icon-collection-tag' },
      },
      {
        path: '/article',
        name: 'article',
        component: BlankLayout,
        redirect: '/article/list',
        meta: { title: '文章管理', icon: 'el-icon-s-management' },
        children: [
          {
            path: '/article/list',
            name: 'articlelist',
            component: () => import('../views/Article/ArticleList'),
            meta: { title: '文章列表', icon: 'el-icon-s-order' },
          },
          {
            path: '/article/edit',
            name: 'articleedit',
            component: () => import('../views/Article/ArticleEdit'),
            meta: { title: '写文章', icon: 'el-icon-circle-plus' },
          },
          {
            path: '/article/edit/:id',
            hidden: true,
            component: () => import('../views/Article/ArticleEdit.vue'),
            meta: { title: '编辑文章', icon: 'el-icon-menu' },
            props: true,
          },
        ],
      },
      {
        path: '/link',
        name: 'link',
        component: BlankLayout,
        redirect: '/link/friend',
        meta: { title: '链接管理', icon: 'el-icon-link' },
        children: [
          {
            path: '/link/friend',
            name: 'friend',
            component: () => import('../views/Link/FriendLink.vue'),
            meta: { title: '友链-图标', icon: 'el-icon-s-promotion' },
          },
          {
            path: '/link/tool',
            name: 'tool',
            component: () => import('../views/Link/ToolLink.vue'),
            meta: { title: '工具链接', icon: 'el-icon-s-tools' },
          },
        ],
      },
      {
        path: '/loginadmin',
        name: 'loginadmin',
        component: () => import('../views/Login/LoginAdmin.vue'),
        meta: {
          title: '管理员',
          icon: 'el-icon-s-custom',
        },
      },
      {
        path: '/about',
        name: 'about',
        meta: { title: '关于我们', icon: 'el-icon-s-operation' },
        component: () => import('../views/About/About.vue'),
        children: [
          {
            path: '/about/add',
            name: 'aboutAdd',
            hidden: true,
            component: () => import('../views/About/Add.vue'),
            meta: { title: '创建', icon: 'el-icon-user-solid' },
          },
        ],
      },
    ],
  },
]
