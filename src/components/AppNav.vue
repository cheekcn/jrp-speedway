<template>
  <nav class="app-nav" :class="{ scrolled: isScrolled }">
    <div class="nav-inner container">
      <RouterLink to="/" class="nav-logo">
        <span class="logo-jrp">JRP</span>
        <span class="logo-speedway">SPEEDWAY</span>
        <span class="logo-flag">🏁</span>
      </RouterLink>

      <div class="nav-links" :class="{ open: menuOpen }">
        <RouterLink to="/track" @click="menuOpen = false">Track</RouterLink>
        <RouterLink to="/rentals" @click="menuOpen = false">Rent</RouterLink>
        <RouterLink to="/events" @click="menuOpen = false">Events</RouterLink>
        <RouterLink to="/league" @click="menuOpen = false">League</RouterLink>
        <RouterLink to="/shop" @click="menuOpen = false">Shop</RouterLink>
        <RouterLink to="/blog" @click="menuOpen = false">Blog</RouterLink>
        <RouterLink to="/admin/login" class="btn btn-primary nav-cta" @click="menuOpen = false">
          Admin
        </RouterLink>
      </div>

      <button class="nav-hamburger" @click="menuOpen = !menuOpen" :aria-expanded="menuOpen">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="nav-stripe">
      <span></span><span class="y"></span><span></span><span></span><span></span>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const menuOpen = ref(false)

const handleScroll = () => { isScrolled.value = window.scrollY > 20 }
onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.app-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  background: rgba(5,5,5,0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}
.app-nav.scrolled {
  background: rgba(5,5,5,0.97);
  border-bottom-color: var(--gray-700);
  box-shadow: 0 4px 30px rgba(0,0,0,0.5);
}
.nav-inner {
  height: var(--nav-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-logo {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-family: var(--font-display);
  font-weight: 900;
  text-transform: uppercase;
}
.logo-jrp {
  font-size: 1.8rem;
  color: var(--red);
  letter-spacing: -0.02em;
}
.logo-speedway {
  font-size: 1rem;
  letter-spacing: 0.15em;
  color: var(--white);
}
.logo-flag { font-size: 1rem; }

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}
.nav-links a {
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 6px 14px;
  color: var(--gray-200);
  transition: color 0.15s;
  border-radius: 2px;
}
.nav-links a:hover,
.nav-links a.router-link-active:not(.nav-cta) {
  color: var(--white);
}
.nav-links a.router-link-active:not(.nav-cta) {
  color: var(--red);
}
.nav-cta {
  margin-left: 12px;
  padding: 8px 20px !important;
  font-size: 0.8rem !important;
}

.nav-stripe {
  display: flex;
  height: 3px;
}
.nav-stripe span { flex: 1; background: var(--red); }
.nav-stripe span.y { flex: 0 0 24px; background: var(--yellow); }

.nav-hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}
.nav-hamburger span {
  display: block;
  width: 24px; height: 2px;
  background: var(--white);
  transition: var(--transition);
}

@media (max-width: 768px) {
  .nav-hamburger { display: flex; }
  .nav-links {
    position: fixed;
    top: var(--nav-h);
    left: 0; right: 0;
    flex-direction: column;
    background: var(--black-deep);
    border-bottom: 1px solid var(--gray-700);
    padding: 16px 24px 24px;
    gap: 4px;
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition: all 0.25s ease;
  }
  .nav-links.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: all;
  }
  .nav-links a { font-size: 1.1rem; width: 100%; padding: 10px 16px; }
  .nav-cta { margin-left: 0; margin-top: 8px; width: 100%; justify-content: center; }
}
</style>
