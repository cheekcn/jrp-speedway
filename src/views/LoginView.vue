<template>
  <main class="login-page">
    <div class="login-card">
      <RouterLink to="/" class="login-logo">
        <span class="text-red">JRP</span> SPEEDWAY
      </RouterLink>
      <div class="login-header">
        <p class="page-hero-eyebrow">// ADMIN ACCESS</p>
        <h1>Sign In</h1>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" placeholder="admin@jrpspeedway.com" required autocomplete="email" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" placeholder="••••••••" required autocomplete="current-password" />
        </div>

        <div v-if="error" class="alert">{{ error }}</div>

        <button type="submit" class="btn btn-primary w-full" style="justify-content:center" :disabled="loading">
          {{ loading ? 'Signing in…' : 'Sign In' }}
        </button>
      </form>

      <RouterLink to="/" class="back-home">← Back to site</RouterLink>
    </div>

    <div class="login-bg">
      <div class="login-grid"></div>
      <div class="login-text">ADMIN</div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    const redirect = route.query.redirect || '/admin'
    router.push(redirect)
  } catch (e) {
    error.value = e.message || 'Invalid credentials. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 480px 1fr;
  background: var(--black-deep);
}
.login-card {
  background: var(--gray-900);
  border-right: 1px solid var(--gray-700);
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.login-logo {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 48px;
  display: block;
}
.login-header { margin-bottom: 36px; }
.login-header h1 { font-size: 2.5rem; }

.login-form { display: flex; flex-direction: column; gap: 20px; }
.back-home {
  display: block;
  margin-top: 24px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--gray-400);
  transition: color 0.15s;
}
.back-home:hover { color: var(--red); }

.login-bg {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(232,0,15,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(232,0,15,0.06) 1px, transparent 1px);
  background-size: 48px 48px;
}
.login-text {
  font-family: var(--font-display);
  font-size: clamp(6rem, 15vw, 18rem);
  font-weight: 900;
  color: var(--gray-900);
  letter-spacing: -0.02em;
  user-select: none;
  position: relative;
}

@media (max-width: 768px) {
  .login-page { grid-template-columns: 1fr; }
  .login-bg { display: none; }
  .login-card { min-height: 100vh; }
}
</style>
