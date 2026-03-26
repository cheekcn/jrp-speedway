// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const routes = [
  // ─── Public ──────────────────────────────────────────────────────────────
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/track',
    name: 'track',
    component: () => import('@/views/TrackView.vue')
  },
  {
    path: '/rentals',
    name: 'rentals',
    component: () => import('@/views/RentalsView.vue')
  },
  {
    path: '/events',
    name: 'events',
    component: () => import('@/views/EventsView.vue')
  },
  {
    path: '/league',
    name: 'league',
    component: () => import('@/views/LeagueView.vue')
  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import('@/views/ShopView.vue')
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/views/BlogView.vue')
  },
  {
    path: '/blog/:id',
    name: 'blog-post',
    component: () => import('@/views/BlogPostView.vue')
  },
  // ─── Auth ─────────────────────────────────────────────────────────────────
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/views/admin/LoginView.vue')
  },
  // ─── Admin (protected) ────────────────────────────────────────────────────
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/DashboardView.vue')
      },
      {
        path: 'blog',
        name: 'admin-blog',
        component: () => import('@/views/admin/BlogManager.vue')
      },
      {
        path: 'blog/new',
        name: 'admin-blog-new',
        component: () => import('@/views/admin/BlogEditor.vue')
      },
      {
        path: 'blog/:id/edit',
        name: 'admin-blog-edit',
        component: () => import('@/views/admin/BlogEditor.vue')
      },
      {
        path: 'events',
        name: 'admin-events',
        component: () => import('@/views/admin/EventsManager.vue')
      },
      {
        path: 'shop',
        name: 'admin-shop',
        component: () => import('@/views/admin/ShopManager.vue')
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/views/admin/UsersManager.vue'),
        meta: { requiresSuperAdmin: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresSuperAdmin && !auth.isSuperAdmin) {
    return { name: 'admin-dashboard' }
  }
  if (to.name === 'admin-login' && auth.isAdmin) {
    return { name: 'admin-dashboard' }
  }
})

export default router
