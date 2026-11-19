<template>
  <nav class="app-nav" :class="{ scrolled: isScrolled }">
    <div class="nav-inner container">
      <RouterLink to="/" class="nav-logo">
        <span class="logo-jrp">JRP</span>
        <span class="logo-speedway">SPEEDWAY</span>
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
    <div class="nav-stripe"><span class="red"></span><span class="y"></span><span class="checker-strip"></span></div>
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
  background: rgba(8, 8, 10, 0.7);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  transition: background 0.25s ease, box-shadow 0.25s ease;
}
.app-nav.scrolled {
  background: rgba(8, 8, 10, 0.94);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
}
.nav-inner {
  height: var(--nav-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-weight: 900;
  font-style: italic;
  text-transform: uppercase;
}
.logo-jrp {
  font-size: 1.6rem;
  line-height: 1;
  color: var(--white);
  background: linear-gradient(100deg, var(--primary), var(--primary-light));
  padding: 4px 14px 2px 10px;
  clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
  letter-spacing: 0;
}
.logo-speedway {
  font-size: 1.05rem;
  letter-spacing: 0.18em;
  color: var(--text);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
}
.nav-links a {
  position: relative;
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 6px 14px;
  color: var(--gray-400);
  transition: color 0.15s;
}
.nav-links a:not(.nav-cta)::after {
  content: '';
  position: absolute;
  left: 14px; right: 14px;
  bottom: 0;
  height: 3px;
  background: var(--primary);
  transform: skewX(-30deg) scaleX(0);
  transition: transform 0.2s ease;
}
.nav-links a:not(.nav-cta):hover { color: var(--text); }
.nav-links a:not(.nav-cta):hover::after { transform: skewX(-30deg) scaleX(0.5); }
.nav-links a.router-link-active:not(.nav-cta) { color: var(--white); }
.nav-links a.router-link-active:not(.nav-cta)::after { transform: skewX(-30deg) scaleX(1); }
.nav-cta {
  margin-left: 12px;
  padding: 8px 22px !important;
  font-size: 0.8rem !important;
  color: var(--white) !important;
}

.nav-stripe {
  display: flex;
  height: 3px;
  gap: 4px;
}
.nav-stripe .red { flex: 1; background: linear-gradient(90deg, transparent, var(--primary) 30%); }
.nav-stripe .y { flex: 0 0 24px; background: var(--yellow); transform: skewX(-30deg); }
.nav-stripe .checker-strip { flex: 0 0 120px; height: 3px; background-size: 6px 6px; }

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
  background: var(--text);
  transition: var(--transition);
}

@media (max-width: 768px) {
  .nav-hamburger { display: flex; }
  .nav-links {
    position: fixed;
    top: var(--nav-h);
    left: 0; right: 0;
    flex-direction: column;
    align-items: stretch;
    background: var(--black);
    border-bottom: 3px solid var(--primary);
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
  .nav-links a { font-size: 1.15rem; width: 100%; padding: 10px 16px; }
  .nav-links a:not(.nav-cta)::after { left: 0; right: auto; width: 4px; height: 100%; transform: scaleY(0); }
  .nav-links a.router-link-active:not(.nav-cta)::after { transform: scaleY(1); }
  .nav-links a:not(.nav-cta):hover::after { transform: scaleY(0.5); }
  .nav-cta { margin-left: 0; margin-top: 8px; width: 100%; justify-content: center; }
  .logo-speedway { font-size: 0.9rem; }
}
</style>
