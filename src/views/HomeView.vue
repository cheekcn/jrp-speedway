<template>
  <main class="home">
    <!-- ── HERO ── -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-grid"></div>
        <div class="hero-glow"></div>
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
          <span class="text-blue" style="color:var(--blue-mid)">WIN.</span>
        </h1>
        <p class="hero-sub">
          JRP Speedway — Tulsa's most intense outdoor karting experience.
          Rental sessions, championship leagues, and competition karts for sale.
        </p>
        <div class="hero-actions">
          <RouterLink to="/rentals" class="btn btn-primary">Book a Session</RouterLink>
          <RouterLink to="/events" class="btn btn-outline">View Events</RouterLink>
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
              <svg viewBox="0 0 680 420" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <marker id="arr-h" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </marker>
                </defs>
                <path d="M 120 80 C 80 80, 46 96, 46 130 C 46 164, 46 175, 46 200 C 46 225, 46 236, 46 270 C 46 304, 80 320, 120 320 L 560 320 C 596 320, 616 305, 616 280 C 616 255, 596 244, 560 244 L 260 244 C 240 244, 224 232, 224 214 C 224 206, 224 200, 224 200 C 224 200, 224 194, 224 186 C 224 168, 240 156, 260 156 L 560 156 C 596 156, 616 145, 616 120 C 616 95, 596 80, 560 80 Z"
                  fill="none" stroke="#111" stroke-width="62" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M 120 80 C 80 80, 46 96, 46 130 C 46 164, 46 175, 46 200 C 46 225, 46 236, 46 270 C 46 304, 80 320, 120 320 L 560 320 C 596 320, 616 305, 616 280 C 616 255, 596 244, 560 244 L 260 244 C 240 244, 224 232, 224 214 C 224 206, 224 200, 224 200 C 224 200, 224 194, 224 186 C 224 168, 240 156, 260 156 L 560 156 C 596 156, 616 145, 616 120 C 616 95, 596 80, 560 80 Z"
                  fill="none" stroke="#2d2d2d" stroke-width="54" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M 120 80 C 80 80, 46 96, 46 130 C 46 164, 46 175, 46 200 C 46 225, 46 236, 46 270 C 46 304, 80 320, 120 320 L 560 320 C 596 320, 616 305, 616 280 C 616 255, 596 244, 560 244 L 260 244 C 240 244, 224 232, 224 214 C 224 206, 224 200, 224 200 C 224 200, 224 194, 224 186 C 224 168, 240 156, 260 156 L 560 156 C 596 156, 616 145, 616 120 C 616 95, 596 80, 560 80 Z"
                  fill="none" stroke="#E8000F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="10 6" opacity="0.85"/>
                <line x1="440" y1="80" x2="300" y2="80" stroke="#E8000F" stroke-width="1.6" marker-end="url(#arr-h)" opacity="0.9"/>
                <line x1="300" y1="200" x2="440" y2="200" stroke="#E8000F" stroke-width="1.6" marker-end="url(#arr-h)" opacity="0.9"/>
                <line x1="440" y1="320" x2="300" y2="320" stroke="#E8000F" stroke-width="1.6" marker-end="url(#arr-h)" opacity="0.9"/>
                <line x1="340" y1="53" x2="340" y2="107" stroke="#FFD000" stroke-width="3.5"/>
                <text x="340" y="44" text-anchor="middle" font-family="monospace" font-size="9" fill="#FFD000" font-weight="bold">S/F</text>
              </svg>
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
        <h2>Ready to <span class="text-red">go flat out?</span></h2>
        <p>Book a rental session or register for a league race.</p>
        <div style="display:flex;gap:16px;flex-wrap:wrap">
          <RouterLink to="/rentals" class="btn btn-primary">Book Now</RouterLink>
          <RouterLink to="/league" class="btn btn-outline">Join the League</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUpcomingEvents } from '@/firebase/services'

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
  'Professional-grade electric & gas karts',
  'Championship-caliber track layout',
  'Timing system with live leaderboard',
  'TSRS-affiliated racing league',
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
  background: var(--black);
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(232,0,15,0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(232,0,15,0.07) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent);
}
.hero-glow {
  position: absolute;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 60%;
  background: radial-gradient(ellipse, rgba(12,59,122,0.15) 0%, transparent 70%);
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
.rev-bar.active { background: var(--blue); }
.rev-bar:nth-child(7).active,
.rev-bar:nth-child(8).active { background: var(--blue-mid); }

.hero-title {
  font-size: clamp(4rem, 12vw, 10rem);
  line-height: 0.9;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 28px;
}
.hero-title .outline {
  -webkit-text-stroke: 2px var(--white);
  color: transparent;
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
.stat { display: flex; flex-direction: column; gap: 2px; }
.stat-val {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 900;
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
.stat-divider {
  width: 1px;
  height: 36px;
  background: var(--gray-700);
}
.hero-scroll-hint {
  position: absolute;
  bottom: 32px;
  right: 48px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: var(--blue-mid);
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
.quick-nav { background: var(--off-white); border-top: 1px solid var(--gray-700); border-bottom: 1px solid var(--gray-700); }
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
  background: var(--white);
  padding: 28px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: background 0.15s;
}
.qnav-card:hover { background: var(--off-white); }
.qnav-card:hover .qnav-arrow { transform: translateX(4px); color: var(--blue); }
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
  color: var(--blue);
  font-weight: 700;
  font-size: 0.9rem;
}
.track-diagram {
  background: var(--black);
  border: 1px solid #1a3260;
  border-radius: 2px;
  padding: 32px;
  position: relative;
}
.track-label {
  position: absolute;
  top: 16px;
  left: 16px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: var(--blue-mid);
}

/* ── Events teaser ── */
.events-teaser { background: var(--off-white); border-top: 1px solid var(--gray-700); border-bottom: 1px solid var(--gray-700); }
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
  background: var(--blue);
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
  background: var(--blue);
  border-top: 1px solid var(--blue-dark);
  border-bottom: 1px solid var(--blue-dark);
}
.cta-inner {
  padding: 72px 24px;
}
.cta-inner h2 { font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 12px; }
.cta-inner p { color: rgba(255,255,255,0.7); margin-bottom: 28px; }

@media (max-width: 900px) {
  .why-layout { grid-template-columns: 1fr; gap: 40px; }
  .tease-header { flex-direction: column; align-items: flex-start; gap: 16px; }
}
</style>
