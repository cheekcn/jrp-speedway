<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-top">
        <RouterLink to="/admin" class="sidebar-logo">
          <span class="text-red">JRP</span>
          <span v-if="!sidebarCollapsed"> ADMIN</span>
        </RouterLink>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          {{ sidebarCollapsed ? '›' : '‹' }}
        </button>
      </div>

      <nav class="sidebar-nav">
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" class="nav-item" :title="item.label">
          <span class="nav-icon">{{ item.icon }}</span>
          <span v-if="!sidebarCollapsed" class="nav-label">{{ item.label }}</span>
        </RouterLink>
        <RouterLink
          v-if="auth.isSuperAdmin"
          to="/admin/users"
          class="nav-item"
          title="Admin Users"
        >
          <span class="nav-icon">👥</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Users</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="admin-user" v-if="!sidebarCollapsed">
          <span class="user-email">{{ auth.adminProfile?.email }}</span>
          <span class="user-role badge" :class="auth.isSuperAdmin ? 'badge-yellow' : 'badge-outline'">
            {{ auth.adminProfile?.role || 'admin' }}
          </span>
        </div>
        <button class="btn btn-ghost logout-btn" @click="handleLogout" title="Sign out">
          <span>🚪</span>
          <span v-if="!sidebarCollapsed">Sign Out</span>
        </button>
        <RouterLink to="/" class="btn btn-ghost logout-btn" title="View site" v-if="!sidebarCollapsed">
          <span>🌐</span> View Site
        </RouterLink>
      </div>
    </aside>

    <!-- Main content -->
    <div class="admin-main">
      <div class="admin-topbar">
        <h2 class="page-name">{{ currentPageName }}</h2>
        <div class="topbar-right">
          <span class="text-mono text-muted" style="font-size:0.7rem">{{ formattedDate }}</span>
        </div>
      </div>
      <div class="admin-content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const sidebarCollapsed = ref(false)

const navItems = [
  { to: '/admin', icon: '📊', label: 'Dashboard' },
  { to: '/admin/blog', icon: '✍️', label: 'Blog Posts' },
  { to: '/admin/events', icon: '📅', label: 'Events' },
  { to: '/admin/shop', icon: '🛒', label: 'Shop / Products' },
]

const pageNames = {
  'admin-dashboard': 'Dashboard',
  'admin-blog': 'Blog Posts',
  'admin-blog-new': 'New Post',
  'admin-blog-edit': 'Edit Post',
  'admin-events': 'Events',
  'admin-shop': 'Shop / Products',
  'admin-users': 'Admin Users',
}
const currentPageName = computed(() => pageNames[route.name] || 'Admin')
const formattedDate = computed(() => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))

const handleLogout = async () => {
  await auth.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--black-deep);
}

/* ── Sidebar ── */
.admin-sidebar {
  width: 240px;
  background: var(--gray-900);
  border-right: 1px solid var(--gray-700);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 100;
  transition: width 0.2s ease;
  overflow: hidden;
}
.admin-sidebar.collapsed { width: 64px; }

.sidebar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px;
  border-bottom: 1px solid var(--gray-700);
  height: 64px;
}
.sidebar-logo {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}
.collapse-btn {
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  font-size: 1.1rem;
  padding: 4px;
  transition: color 0.15s;
  flex-shrink: 0;
}
.collapse-btn:hover { color: var(--white); }

.sidebar-nav {
  flex: 1;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 10px;
  border-radius: 2px;
  color: var(--gray-400);
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: all 0.15s;
  white-space: nowrap;
}
.nav-item:hover { color: var(--white); background: var(--gray-800); }
.nav-item.router-link-active { color: var(--red); background: rgba(232,0,15,0.08); }
.nav-icon { font-size: 1rem; width: 20px; text-align: center; flex-shrink: 0; }
.nav-label { font-size: 0.82rem; }

.sidebar-footer {
  padding: 16px 8px;
  border-top: 1px solid var(--gray-700);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.admin-user {
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.user-email { font-size: 0.75rem; color: var(--gray-400); font-family: var(--font-mono); word-break: break-all; }
.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  font-size: 0.78rem;
  color: var(--gray-400);
  border-radius: 2px;
  width: 100%;
  text-align: left;
}
.logout-btn:hover { color: var(--white); background: var(--gray-800); }

/* ── Main ── */
.admin-main {
  margin-left: 240px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.2s ease;
}
.admin-sidebar.collapsed ~ .admin-main { margin-left: 64px; }

.admin-topbar {
  height: 64px;
  background: var(--gray-900);
  border-bottom: 1px solid var(--gray-700);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 50;
}
.page-name {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.admin-content { padding: 32px; flex: 1; }

@media (max-width: 768px) {
  .admin-sidebar { transform: translateX(-100%); }
  .admin-main { margin-left: 0; }
}
</style>
