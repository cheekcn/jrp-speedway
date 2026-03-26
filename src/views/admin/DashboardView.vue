<template>
  <div class="dashboard">
    <div class="welcome-banner">
      <div>
        <p class="page-hero-eyebrow">// COMMAND CENTER</p>
        <h1>Welcome back<span v-if="auth.adminProfile?.name">, {{ auth.adminProfile.name }}</span></h1>
      </div>
      <div class="status-dot">
        <span class="dot"></span>
        <span class="text-mono text-muted" style="font-size:0.7rem">LIVE</span>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <span class="stat-icon">{{ stat.icon }}</span>
        <div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="section-header">
      <h2>Quick Actions</h2>
    </div>
    <div class="actions-grid">
      <RouterLink v-for="action in actions" :key="action.label" :to="action.to" class="action-card card">
        <span class="action-icon">{{ action.icon }}</span>
        <div class="action-info">
          <strong>{{ action.label }}</strong>
          <p>{{ action.desc }}</p>
        </div>
        <span class="action-arrow">→</span>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { getCollection } from '@/firebase/services'
import { orderBy } from 'firebase/firestore'

const auth = useAuthStore()

const stats = ref([
  { icon: '✍️', label: 'Blog Posts', value: '—' },
  { icon: '📅', label: 'Events', value: '—' },
  { icon: '🛒', label: 'Products Listed', value: '—' },
  { icon: '👥', label: 'Admin Users', value: '—' },
])

onMounted(async () => {
  try {
    const [posts, events, products, admins] = await Promise.all([
      getCollection('blog'),
      getCollection('events'),
      getCollection('products'),
      getCollection('admins'),
    ])
    stats.value[0].value = posts.length
    stats.value[1].value = events.length
    stats.value[2].value = products.length
    stats.value[3].value = admins.length
  } catch { /* permissions may vary */ }
})

const actions = [
  { to: '/admin/blog/new', icon: '➕', label: 'New Blog Post', desc: 'Write and publish an article' },
  { to: '/admin/events', icon: '📅', label: 'Manage Events', desc: 'Add or edit upcoming races' },
  { to: '/admin/shop', icon: '🛒', label: 'Update Shop', desc: 'Add or edit products for sale' },
  { to: '/admin/blog', icon: '📝', label: 'All Blog Posts', desc: 'View, edit, or delete posts' },
]
</script>

<style scoped>
.dashboard { max-width: 900px; }
.welcome-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 36px;
}
.welcome-banner h1 { font-size: 2rem; margin-top: 8px; }
.status-dot { display: flex; align-items: center; gap: 8px; }
.dot {
  width: 8px; height: 8px;
  background: #00C853;
  border-radius: 50%;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1px;
  background: var(--gray-700);
  border: 1px solid var(--gray-700);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 40px;
}
.stat-card {
  background: var(--gray-800);
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.stat-icon { font-size: 1.5rem; }
.stat-value {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 900;
  line-height: 1;
  color: var(--red);
}
.stat-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: var(--gray-400);
  text-transform: uppercase;
  margin-top: 2px;
}

.section-header { margin-bottom: 16px; }
.section-header h2 { font-size: 1rem; letter-spacing: 0.08em; }

.actions-grid { display: flex; flex-direction: column; gap: 12px; }
.action-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 24px;
}
.action-icon { font-size: 1.3rem; width: 28px; text-align: center; }
.action-info strong {
  font-family: var(--font-display);
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 2px;
}
.action-info p { font-size: 0.8rem; color: var(--gray-400); }
.action-arrow { margin-left: auto; color: var(--gray-600); transition: all 0.15s; }
.action-card:hover .action-arrow { transform: translateX(4px); color: var(--red); }
</style>
