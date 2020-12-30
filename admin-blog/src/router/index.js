import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior: () => ({ y: 0 }),
  routes,
})

router.beforeEach((to, from, next) => {
  // console.log(to, from, next)
  NProgress.start()
  const hasToken = getToken()
  console.log(hasToken)
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    }
  } else {
    if (to.path !== '/login') {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
