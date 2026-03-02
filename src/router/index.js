import { createRouter, createWebHashHistory } from 'vue-router'
import { useAppStore } from '../stores/app'

const routes = [
  { path: '/', redirect: '/connection' },
  { path: '/connection', component: () => import('../views/ConnectionView.vue'), meta: { public: true } },
  { path: '/login', component: () => import('../views/LoginView.vue'), meta: { public: true } },
  { path: '/terminal', component: () => import('../views/TerminalView.vue') },
  { path: '/pos', component: () => import('../views/PosMainView.vue') },
  { path: '/payment', component: () => import('../views/PaymentView.vue') },
  { path: '/bill-history', component: () => import('../views/BillHistoryView.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  const store = useAppStore()
  if (!to.meta.public && !store.isLoggedIn) {
    return '/login'
  }
})

export default router
