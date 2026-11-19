<template>
  <footer class="app-footer">
    <div class="checker-strip footer-checker"></div>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="brand-logo">
            <span class="brand-jrp">JRP</span> SPEEDWAY
          </div>
          <p>Tulsa's premier outdoor karting experience. Race rental karts or compete in our league.</p>
          <div class="social-row">
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="YouTube">YT</a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Navigate</h4>
          <RouterLink to="/track">Track Info</RouterLink>
          <RouterLink to="/rentals">Rental Karts</RouterLink>
          <RouterLink to="/events">Events</RouterLink>
          <RouterLink to="/league">Racing League</RouterLink>
          <RouterLink to="/shop">Shop</RouterLink>
          <RouterLink to="/blog">Blog</RouterLink>
        </div>

        <div class="footer-col">
          <h4>Contact</h4>
          <a href="tel:+19184467000">📞 (918) 446-7000</a>
          <a href="mailto:info@jrpspeedway.com">✉ info@jrpspeedway.com</a>
          <p class="addr">5920 W 51st St<br>Tulsa, OK 74107</p>
        </div>

        <div class="footer-col">
          <h4>Hours</h4>
          <p v-if="hours.season" class="season">{{ hours.season }}</p>
          <div v-for="g in hourGroups" :key="g.label" class="hours-row"><span>{{ g.label }}</span><span>{{ g.time }}</span></div>
        </div>
      </div>

      <div class="footer-bottom">
        <span class="text-muted">© {{ year }} JRP Speedway. All rights reserved.</span>
        <RouterLink to="/admin/login" class="text-muted admin-link">Admin</RouterLink>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useHours, groupHours } from '@/composables/useHours'

const year = new Date().getFullYear()
const hours = useHours()
const hourGroups = computed(() => groupHours(hours.days))
</script>

<style scoped>
.app-footer {
  background: var(--black);
  padding-bottom: 32px;
  position: relative;
}
.app-footer::before {
  content: '';
  position: absolute;
  top: 8px; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary), var(--primary-light) 60%, var(--yellow));
}
.footer-checker {
  margin-bottom: 64px;
  opacity: 0.85;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
}
.brand-logo {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 900;
  text-transform: uppercase;
  font-style: italic;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
  color: var(--text);
}
.brand-jrp {
  display: inline-block;
  color: var(--white);
  background: var(--primary);
  padding: 2px 12px 0 8px;
  clip-path: polygon(7px 0, 100% 0, calc(100% - 7px) 100%, 0 100%);
}
.footer-brand p {
  font-size: 0.875rem;
  color: var(--gray-400);
  line-height: 1.6;
  margin-bottom: 20px;
  max-width: 240px;
}
.social-row { display: flex; gap: 12px; }
.social-row a {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  background: var(--gray-900);
  border: 1px solid var(--gray-700);
  padding: 6px 10px;
  border-radius: 2px;
  transition: var(--transition);
}
.social-row a:hover { border-color: var(--primary); color: var(--white); background: var(--primary); }

.footer-col h4 {
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--primary-bright);
  margin-bottom: 16px;
}
.footer-col a,
.footer-col p {
  display: block;
  font-size: 0.875rem;
  color: var(--gray-400);
  margin-bottom: 8px;
  transition: color 0.15s;
}
.footer-col a:hover { color: var(--white); }
.addr { line-height: 1.6; }

.hours-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--gray-400);
  padding: 4px 0;
  border-bottom: 1px solid var(--gray-800);
}
.hours-row span:last-child { color: var(--gray-200); }
.footer-col .season {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--yellow);
  margin-bottom: 6px;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 24px;
  border-top: 1px solid var(--gray-800);
  font-size: 0.8rem;
}
.admin-link { opacity: 0.3; }
.admin-link:hover { opacity: 1; }

@media (max-width: 900px) {
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
}
@media (max-width: 600px) {
  .footer-grid { grid-template-columns: 1fr; }
}
</style>
