import { createRouter, createWebHistory } from 'vue-router'
import type { RouteMeta } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

declare module 'vue-router' {
  interface RouteMeta {
    roles?: string[]
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: AuthLayout,
      children: [
        { path: '', name: 'Login', component: () => import('@/views/auth/LoginView.vue') },
      ],
    },
    {
      path: '/register',
      component: AuthLayout,
      children: [
        { path: '', name: 'Register', component: () => import('@/views/auth/RegisterView.vue') },
      ],
    },
    {
      path: '/',
      component: DefaultLayout,
      redirect: '/instruments',
      children: [
        { path: 'instruments', name: 'InstrumentList', component: () => import('@/views/instrument/InstrumentListView.vue') },
        { path: 'instruments/:id', name: 'InstrumentDetail', component: () => import('@/views/instrument/InstrumentDetailView.vue') },
        { path: 'instruments/:id/reserve', name: 'ReservationCreate', component: () => import('@/views/reservation/ReservationCreateView.vue') },
        { path: 'reservations', name: 'ReservationList', component: () => import('@/views/reservation/ReservationListView.vue') },
        {
          path: 'admin',
          meta: { roles: ['admin'] },
          children: [
            { path: '', redirect: '/admin/instruments' },
            { path: 'instruments', name: 'AdminInstrument', component: () => import('@/views/admin/AdminInstrumentView.vue') },
            { path: 'reservations', name: 'AdminReservation', component: () => import('@/views/admin/AdminReservationView.vue') },
          ],
        },
      ],
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('access_token')
  const userStr = localStorage.getItem('user')
  let role: string | null = null
  if (userStr) {
    try { role = JSON.parse(userStr).role } catch { /* ignore */ }
  }

  const requiresAdmin = to.matched.some(r => {
    const roles = (r.meta as RouteMeta)?.roles
    return roles?.includes('admin') ?? false
  })

  if (!token && to.path !== '/login' && to.path !== '/register') {
    next('/login')
  } else if (token && (to.path === '/login' || to.path === '/register')) {
    next('/instruments')
  } else if (requiresAdmin && role !== 'admin') {
    next('/instruments')
  } else {
    next()
  }
})

export default router
