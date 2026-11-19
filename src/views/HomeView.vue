<template>
  <main class="home">
    <!-- ── HERO ── -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-grid"></div>
        <div class="hero-glow"></div>
        <div class="hero-slash"></div>
        <div class="hero-lines"></div>
      </div>
      <div class="container hero-content">
        <div class="hero-eyebrow">
          <span class="badge">Tulsa, Oklahoma</span>
          <span class="rev-counter">
            <span v-for="n in 8" :key="n" :class="{ active: n <= revLevel }" class="rev-bar"></span>
          </span>
        </div>
        <h1 class="hero-title">
          <span>RACE.</span>
          <span class="outline">COMPETE.</span>
          <span class="win">WIN.</span>
        </h1>
        <p class="hero-sub">
          JRP Speedway — Tulsa's most intense outdoor karting experience.
          Rental sessions, championship leagues, and competition karts for sale.
        </p>
        <div class="hero-actions">
          <RouterLink to="/rentals" class="btn btn-primary">Book a Session</RouterLink>
          <RouterLink to="/events" class="btn btn-outline hero-outline-btn">View Events</RouterLink>
        </div>
        <div class="hero-stats">
          <div class="stat"><span class="stat-val">1/4</span><span class="stat-label">Mile Track</span></div>
          <div class="stat-divider"></div>
          <div class="stat"><span class="stat-val">45+</span><span class="stat-label">MPH Top Speed</span></div>
          <div class="stat-divider"></div>
          <div class="stat"><span class="stat-val">270°</span><span class="stat-label">Banked Corner</span></div>
          <div class="stat-divider"></div>
          <div class="stat"><span class="stat-val">OUTDOOR</span><span class="stat-label">Year-Round</span></div>
        </div>
      </div>
      <div class="hero-scroll-hint">SCROLL</div>
      <div class="checker-strip hero-checker"></div>
    </section>

    <!-- ── QUICK NAV CARDS ── -->
    <section class="section quick-nav">
      <div class="container">
        <div class="qnav-grid">
          <RouterLink v-for="item in quickNav" :key="item.path" :to="item.path" class="qnav-card">
            <div class="qnav-icon">{{ item.icon }}</div>
            <div class="qnav-info">
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
            </div>
            <span class="qnav-arrow">→</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ── WHY JRP ── -->
    <section class="section why-jrp">
      <div class="container">
        <div class="why-layout">
          <div class="why-text">
            <p class="page-hero-eyebrow">Why JRP Speedway</p>
            <h2 class="section-title">Built for<br><span class="text-red">Real Racers</span></h2>
            <p class="section-subtitle">
              We're not a birthday party kart track. JRP was built for drivers who
              want real competition, real speed, and a real racing community.
            </p>
            <ul class="feature-list">
              <li v-for="f in features" :key="f">
                <span class="check">✓</span>{{ f }}
              </li>
            </ul>
            <RouterLink to="/track" class="btn btn-outline" style="margin-top:24px">
              Explore the Track
            </RouterLink>
          </div>
          <div class="why-visual">
            <div class="track-diagram">
              <div class="track-label">JRP LAYOUT</div>
              <TrackMap />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── UPCOMING EVENT TEASER ── -->
    <section class="section events-teaser">
      <div class="container">
        <div class="tease-header">
          <div>
            <div class="accent-line"></div>
            <h2 class="section-title">Upcoming Events</h2>
          </div>
          <RouterLink to="/events" class="btn btn-outline">All Events →</RouterLink>
        </div>
        <div v-if="loadingEvents" class="spinner"></div>
        <div v-else-if="upcomingEvents.length" class="events-row">
          <div v-for="evt in upcomingEvents" :key="evt.id" class="event-card card">
            <div class="event-date">
              <span class="month">{{ formatMonth(evt.eventDate) }}</span>
              <span class="day">{{ formatDay(evt.eventDate) }}</span>
            </div>
            <div class="event-info">
              <span class="badge badge-outline" style="margin-bottom:8px">{{ evt.type || 'Event' }}</span>
              <h3>{{ evt.title }}</h3>
              <p>{{ evt.description }}</p>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>No upcoming events scheduled. Check back soon!</p>
        </div>
      </div>
    </section>

    <!-- ── CTA BANNER ── -->
    <section class="cta-banner">
      <div class="container cta-inner">
        <h2>Ready to <span class="text-yellow">go flat out?</span></h2>
        <p>Book a rental session or register for a league race.</p>
        <div style="display:flex;gap:16px;flex-wrap:wrap">
          <RouterLink to="/rentals" class="btn btn-yellow">Book Now</RouterLink>
          <RouterLink to="/league" class="btn btn-outline cta-outline-btn">Join the League</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUpcomingEvents } from '@/firebase/services'
import TrackMap from '@/components/TrackMap.vue'

const revLevel = ref(3)
const upcomingEvents = ref([])
const loadingEvents = ref(true)

// animate rev counter
let rev = 3
setInterval(() => {
  rev = rev >= 8 ? 1 : rev + 1
  revLevel.value = rev
}, 300)

onMounted(async () => {
  try {
    const evts = await getUpcomingEvents()
    upcomingEvents.value = evts.slice(0, 3)
  } catch { /* no events yet */ }
  loadingEvents.value = false
})

const quickNav = [
  { path: '/rentals', icon: '🏎', title: 'Rental Karts', desc: 'Sessions for all skill levels' },
  { path: '/events', icon: '📅', title: 'Events', desc: 'Races, arrive-and-drives, and more' },
  { path: '/league', icon: '🏆', title: 'Racing League', desc: 'Points-based competition series' },
  { path: '/shop', icon: '🛒', title: 'Karts for Sale', desc: 'Competition karts & tires' },
]

const features = [
  'Professional-grade gas karts',
  'Championship-caliber track layout',
  'Arrive-and-drive events year-round',
  'Onsite kart prep and tuning support',
]

const formatMonth = (ts) => {
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('en', { month: 'short' }).toUpperCase()
}
const formatDay = (ts) => {
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.getDate()
}
</script>

<style scoped>
/* ── Hero ── */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding-top: var(--nav-h);
}
.hero-bg {
  position: absolute;
  inset: 0;
  background: var(--carbon);
  background-color: var(--black);
  background-size: 20px 20px;
  overflow: hidden;
}
.hero-slash {
  position: absolute;
  top: -10%;
  right: -5%;
  width: 27%;
  height: 130%;
  background: linear-gradient(160deg, var(--primary-light) 0%, var(--primary) 45%, var(--primary-dark) 100%);
  transform: skewX(-12deg);
  opacity: 0.9;
  box-shadow: -40px 0 120px rgba(225, 6, 0, 0.45);
}
.hero-slash::before {
  content: '';
  position: absolute;
  top: 0; bottom: 0;
  left: -48px;
  width: 18px;
  background: var(--yellow);
}
.hero-slash::after {
  content: '';
  position: absolute;
  top: 0; bottom: 0;
  left: -86px;
  width: 8px;
  background: var(--primary);
}
.hero-lines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(-72deg, transparent 0 80px, rgba(255,255,255,0.03) 80px 82px);
}
.hero-checker {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 16px;
  background-size: 16px 16px;
  z-index: 2;
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent);
}
.hero-glow {
  position: absolute;
  top: 10%;
  left: -10%;
  width: 70%;
  height: 80%;
  background: radial-gradient(ellipse, rgba(225,6,0,0.18) 0%, transparent 65%);
}
.hero-content {
  position: relative;
  padding-top: 60px;
  padding-bottom: 80px;
}
.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}
.rev-counter {
  display: flex;
  gap: 3px;
  align-items: flex-end;
  height: 20px;
}
.rev-bar {
  width: 4px;
  background: var(--gray-700);
  border-radius: 1px;
  transition: background 0.1s;
}
.rev-bar:nth-child(1) { height: 8px; }
.rev-bar:nth-child(2) { height: 10px; }
.rev-bar:nth-child(3) { height: 12px; }
.rev-bar:nth-child(4) { height: 14px; }
.rev-bar:nth-child(5) { height: 16px; }
.rev-bar:nth-child(6) { height: 17px; }
.rev-bar:nth-child(7) { height: 18px; }
.rev-bar:nth-child(8) { height: 20px; }
.rev-bar.active { background: #00D26A; color: #00D26A; box-shadow: 0 0 8px currentColor; }
.rev-bar:nth-child(n+4).active { background: var(--yellow); color: var(--yellow); }
.rev-bar:nth-child(n+7).active { background: var(--primary-light); color: var(--primary-light); }

.hero-title {
  font-size: clamp(4rem, 12vw, 10rem);
  line-height: 0.9;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 28px;
}
.hero-title { font-style: italic; color: var(--white); }
.hero-title .outline {
  -webkit-text-stroke: 2px var(--white);
  color: transparent;
}
.hero-title .win {
  color: var(--primary-bright);
  text-shadow: 0 0 60px rgba(225, 6, 0, 0.5);
}
.hero-sub {
  font-size: 1.1rem;
  color: var(--gray-200);
  max-width: 500px;
  margin-bottom: 36px;
  line-height: 1.7;
}
.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 56px;
}
.hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.stat { display: flex; flex-direction: column; gap: 2px; padding-left: 12px; border-left: 3px solid var(--primary); }
.stat-val {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 900;
  font-style: italic;
  line-height: 1;
  color: var(--white);
}
.stat-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  color: var(--gray-400);
  text-transform: uppercase;
}
.stat-divider { display: none; }
.hero-scroll-hint {
  position: absolute;
  bottom: 32px;
  right: 48px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: var(--primary-bright);
  writing-mode: vertical-rl;
  display: flex;
  align-items: center;
  gap: 8px;
}
.hero-scroll-hint::after {
  content: '';
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, var(--gray-600), transparent);
}

/* ── Quick nav ── */
.quick-nav { background: var(--surface-alt); border-top: 1px solid var(--gray-700); border-bottom: 1px solid var(--gray-700); }
.qnav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1px;
  background: var(--gray-700);
  border: 1px solid var(--gray-700);
  border-radius: 2px;
  overflow: hidden;
}
.qnav-card {
  position: relative;
  background: var(--surface);
  padding: 28px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: background 0.2s;
}
.qnav-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  background: var(--primary);
  transform: scaleY(0);
  transition: transform 0.25s ease;
}
.qnav-card:hover { background: var(--gray-900); }
.qnav-card:hover::before { transform: scaleY(1); }
.qnav-card:hover .qnav-arrow { transform: translateX(6px); color: var(--primary-bright); }
.qnav-icon { font-size: 1.8rem; }
.qnav-info h3 {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
}
.qnav-info p { font-size: 0.8rem; color: var(--gray-400); }
.qnav-arrow {
  margin-left: auto;
  font-size: 1.1rem;
  color: var(--gray-600);
  transition: all 0.2s;
}

/* ── Why JRP ── */
.why-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}
.feature-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.feature-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  color: var(--gray-200);
}
.check {
  color: var(--primary);
  font-weight: 700;
  font-size: 0.9rem;
}
.track-diagram {
  background: radial-gradient(ellipse at 50% 40%, #15151a, var(--black) 75%);
  box-shadow: 0 30px 80px rgba(0,0,0,0.6);
  border: 1px solid var(--gray-700);
  border-radius: 4px;
  padding: 44px 20px 20px;
  position: relative;
}
.track-label {
  position: absolute;
  top: 16px;
  left: 16px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: var(--primary-bright);
}

/* ── Events teaser ── */
.events-teaser { background: var(--surface-alt); border-top: 1px solid var(--gray-700); border-bottom: 1px solid var(--gray-700); }
.tease-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 32px;
}
.events-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
.event-card {
  display: flex;
  gap: 20px;
  padding: 24px;
}
.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(160deg, var(--primary-light), var(--primary-dark));
  padding: 10px 14px;
  border-radius: 2px;
  min-width: 56px;
}
.month {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.8);
}
.day {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 900;
  line-height: 1;
  color: white;
}
.event-info h3 {
  font-size: 1rem;
  margin-bottom: 6px;
  letter-spacing: 0.03em;
}
.event-info p { font-size: 0.85rem; color: var(--gray-400); }

.empty-state {
  text-align: center;
  color: var(--gray-400);
  padding: 48px;
  border: 1px dashed var(--gray-700);
  border-radius: 2px;
}

/* ── CTA ── */
.cta-banner {
  position: relative;
  overflow: hidden;
  background:
    repeating-linear-gradient(-60deg, transparent 0 40px, rgba(0,0,0,0.08) 40px 80px),
    linear-gradient(100deg, var(--primary-dark) 0%, var(--primary) 50%, var(--primary-light) 100%);
}
.cta-banner::after {
  content: '';
  position: absolute;
  top: 0; bottom: 0; right: 0;
  width: 40%;
  background: var(--checker) 0 0 / 28px 28px;
  opacity: 0.18;
  mask-image: linear-gradient(90deg, transparent, black);
  -webkit-mask-image: linear-gradient(90deg, transparent, black);
}
.cta-inner {
  position: relative;
  z-index: 1;
  padding: 80px 24px;
}
.cta-inner h2 { font-size: clamp(2.2rem, 5vw, 3.6rem); margin-bottom: 12px; color: var(--white); }

/* Hero outline button — on dark background needs white styling */
.hero-outline-btn {
  color: var(--white) !important;
  box-shadow: inset 0 2px 0 rgba(255,255,255,0.6), inset 0 -2px 0 rgba(255,255,255,0.6) !important;
  background: rgba(255,255,255,0.1) !important;
}
.hero-outline-btn:hover {
  color: var(--white) !important;
  box-shadow: inset 0 2px 0 var(--white), inset 0 -2px 0 var(--white) !important;
  background: rgba(255,255,255,0.1) !important;
}

/* CTA outline button — on navy background, white styling that stays visible on hover */
.cta-outline-btn {
  color: var(--white) !important;
  box-shadow: inset 0 2px 0 rgba(255,255,255,0.6), inset 0 -2px 0 rgba(255,255,255,0.6) !important;
  background: rgba(255,255,255,0.1) !important;
}
.cta-outline-btn:hover {
  color: var(--white) !important;
  box-shadow: inset 0 2px 0 var(--white), inset 0 -2px 0 var(--white) !important;
  background: rgba(255,255,255,0.15) !important;
}
.cta-inner p { color: rgba(255,255,255,0.85); margin-bottom: 28px; font-size: 1.1rem; }

@media (max-width: 900px) {
  .hero-slash { width: 40%; right: -30%; opacity: 0.35; }
  .why-layout { grid-template-columns: 1fr; gap: 40px; }
  .tease-header { flex-direction: column; align-items: flex-start; gap: 16px; }
}
</style>
