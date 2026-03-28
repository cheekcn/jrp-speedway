<template>
  <main>
    <div class="page-hero">
      <div class="container">
        <p class="page-hero-eyebrow">// FACILITY</p>
        <h1>The Track</h1>
        <p>Everything you need to know about JRP Speedway — Tulsa's premier karting facility.</p>
      </div>
    </div>

    <!-- Track Specs -->
    <section class="section">
      <div class="container">
        <div class="specs-layout">
          <div>
            <div class="accent-line"></div>
            <h2 class="section-title">Track Specifications</h2>
            <p class="section-subtitle">Designed for real competition with challenging corners and elevation changes.</p>
            <div class="spec-grid">
              <div v-for="spec in specs" :key="spec.label" class="spec-item">
                <span class="spec-val">{{ spec.value }}</span>
                <span class="spec-label">{{ spec.label }}</span>
              </div>
            </div>
          </div>
          <div class="track-map-card card">
            <div class="track-map-header">
              <span class="badge">Track Layout</span>
              <span class="text-mono text-muted" style="font-size:0.7rem">JRP — TULSA, OK</span>
            </div>
            <svg viewBox="0 0 680 420" fill="none" xmlns="http://www.w3.org/2000/svg" class="track-svg">
              <defs>
                <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </marker>
              </defs>
              <!-- Shadow -->
              <path d="M 120 80 C 80 80, 46 96, 46 130 C 46 164, 46 175, 46 200 C 46 225, 46 236, 46 270 C 46 304, 80 320, 120 320 L 560 320 C 596 320, 616 305, 616 280 C 616 255, 596 244, 560 244 L 260 244 C 240 244, 224 232, 224 214 C 224 206, 224 200, 224 200 C 224 200, 224 194, 224 186 C 224 168, 240 156, 260 156 L 560 156 C 596 156, 616 145, 616 120 C 616 95, 596 80, 560 80 Z"
                fill="none" stroke="#111" stroke-width="62" stroke-linecap="round" stroke-linejoin="round"/>
              <!-- Track surface -->
              <path d="M 120 80 C 80 80, 46 96, 46 130 C 46 164, 46 175, 46 200 C 46 225, 46 236, 46 270 C 46 304, 80 320, 120 320 L 560 320 C 596 320, 616 305, 616 280 C 616 255, 596 244, 560 244 L 260 244 C 240 244, 224 232, 224 214 C 224 206, 224 200, 224 200 C 224 200, 224 194, 224 186 C 224 168, 240 156, 260 156 L 560 156 C 596 156, 616 145, 616 120 C 616 95, 596 80, 560 80 Z"
                fill="none" stroke="#2d2d2d" stroke-width="54" stroke-linecap="round" stroke-linejoin="round"/>
              <!-- Racing line -->
              <path d="M 120 80 C 80 80, 46 96, 46 130 C 46 164, 46 175, 46 200 C 46 225, 46 236, 46 270 C 46 304, 80 320, 120 320 L 560 320 C 596 320, 616 305, 616 280 C 616 255, 596 244, 560 244 L 260 244 C 240 244, 224 232, 224 214 C 224 206, 224 200, 224 200 C 224 200, 224 194, 224 186 C 224 168, 240 156, 260 156 L 560 156 C 596 156, 616 145, 616 120 C 616 95, 596 80, 560 80 Z"
                fill="none" stroke="#E8000F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="10 6" opacity="0.85"/>
              <!-- Direction arrows -->
              <line x1="440" y1="80" x2="300" y2="80" stroke="#E8000F" stroke-width="1.8" marker-end="url(#arr)" opacity="0.9"/>
              <line x1="300" y1="200" x2="440" y2="200" stroke="#E8000F" stroke-width="1.8" marker-end="url(#arr)" opacity="0.9"/>
              <line x1="440" y1="320" x2="300" y2="320" stroke="#E8000F" stroke-width="1.8" marker-end="url(#arr)" opacity="0.9"/>
              <!-- S/F line — middle of top straight -->
              <line x1="340" y1="53" x2="340" y2="107" stroke="#FFD000" stroke-width="3.5"/>
              <text x="340" y="44" text-anchor="middle" font-family="monospace" font-size="9" fill="#FFD000" font-weight="bold">S/F</text>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Hours -->
    <section class="section" style="background:var(--gray-900);border-top:1px solid var(--gray-700)">
      <div class="container">
        <div class="accent-line"></div>
        <h2 class="section-title">Hours of Operation</h2>
        <div class="hours-grid">
          <div v-for="h in hours" :key="h.day" class="hours-card card">
            <span class="hours-day">{{ h.day }}</span>
            <span class="hours-time">{{ h.time }}</span>
            <span v-if="h.note" class="hours-note">{{ h.note }}</span>
          </div>
        </div>
        <p class="text-muted" style="margin-top:20px;font-size:0.85rem">
          * Hours subject to change for special events. Check social media or call ahead.
        </p>
      </div>
    </section>

    <!-- Location & Contact -->
    <section class="section">
      <div class="container">
        <div class="contact-layout">
          <div>
            <div class="accent-line"></div>
            <h2 class="section-title">Location & Contact</h2>
            <div class="contact-items">
              <div class="contact-item">
                <span class="contact-icon">📍</span>
                <div>
                  <strong>Address</strong>
                  <p>5920 W 51st St<br>Tulsa, OK 74107</p>
                </div>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📞</span>
                <div>
                  <strong>Phone</strong>
                  <p><a href="tel:+19184467000">(918) 446-7000</a></p>
                </div>
              </div>
              <div class="contact-item">
                <span class="contact-icon">✉</span>
                <div>
                  <strong>Email</strong>
                  <p><a href="mailto:info@jrpspeedway.com">info@jrpspeedway.com</a></p>
                </div>
              </div>
              <div class="contact-item">
                <span class="contact-icon">🌐</span>
                <div>
                  <strong>Social</strong>
                  <p>@JRPSpeedway on Facebook & Instagram</p>
                </div>
              </div>
            </div>
          </div>
          <div class="map-placeholder">
            <div class="map-inner">
              <span>🗺</span>
              <p>5920 W 51st St, Tulsa OK</p>
              <a href="https://maps.google.com/?q=Tulsa+Oklahoma" target="_blank" rel="noopener" class="btn btn-outline" style="margin-top:12px">
                Open in Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Rules & Info -->
    <section class="section" style="background:var(--gray-900);border-top:1px solid var(--gray-700)">
      <div class="container">
        <div class="accent-line"></div>
        <h2 class="section-title">Need to Know</h2>
        <div class="grid-3">
          <div v-for="rule in rules" :key="rule.title" class="rule-card card">
            <span class="rule-icon">{{ rule.icon }}</span>
            <h3>{{ rule.title }}</h3>
            <p>{{ rule.body }}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
const specs = [
  { value: '1/4 mi', label: 'Track Length' },
  { value: '45+ mph', label: 'Top Speed' },
  { value: '270°', label: 'Banked Corner' },
  { value: '4', label: 'Corner Count' },
  { value: 'Outdoor', label: 'Track Type' },
  { value: '12+', label: 'Karts on Track' },
]

const hours = [
  { day: 'Monday', time: '9:00 AM – 6:00 PM' },
  { day: 'Tuesday', time: '9:00 AM – 6:00 PM' },
  { day: 'Wednesday', time: '9:00 AM – 6:00 PM' },
  { day: 'Thursday', time: '9:00 AM – 6:00 PM' },
  { day: 'Friday', time: '9:00 AM – 6:00 PM' },
  { day: 'Saturday', time: '9:00 AM – 6:00 PM' },
  { day: 'Sunday', time: 'Closed' },
]

const rules = [
  { icon: '👟', title: 'Footwear', body: 'Closed-toe shoes required at all times. No sandals, flip-flops, or bare feet on the track.' },
  { icon: '📏', title: 'Height Requirement', body: 'Minimum 54" to drive adult karts. Junior karts available for younger drivers.' },
  { icon: '⚠️', title: 'Waiver Required', body: 'All drivers must sign a liability waiver before racing. Minors require parent/guardian signature.' },
  { icon: '🪖', title: 'Helmets Provided', body: 'Rental helmets and neck collars are included with every session. Personal SNELL/SA rated helmets welcome.' },
  { icon: '🚫', title: 'No Contact', body: 'Bumping, spinning, or aggressive contact will result in immediate removal from the session.' },
  { icon: '🔁', title: 'Group Booking', body: 'Groups of 8+ should book in advance. Private track rentals available for corporate and private events.' },
]
</script>

<style scoped>
.specs-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: start;
}
.spec-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--gray-700);
  border: 1px solid var(--gray-700);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 32px;
}
.spec-item {
  background: var(--gray-800);
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.spec-val {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--red);
}
.spec-label {
  font-size: 0.75rem;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-family: var(--font-mono);
}
.track-map-card { padding: 24px; }
.track-map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.track-svg { width: 100%; border-radius: 2px; }

.hours-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-top: 32px;
}
.hours-card {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.hours-day {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.hours-time {
  font-size: 0.85rem;
  color: var(--gray-200);
}
.hours-note {
  font-size: 0.7rem;
  color: var(--gray-400);
  font-style: italic;
  margin-top: 4px;
}

.contact-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: start;
}
.contact-items { display: flex; flex-direction: column; gap: 24px; margin-top: 32px; }
.contact-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.contact-icon { font-size: 1.3rem; margin-top: 2px; }
.contact-item strong {
  display: block;
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--red);
  margin-bottom: 4px;
}
.contact-item p, .contact-item a {
  font-size: 0.9rem;
  color: var(--gray-200);
}
.contact-item a:hover { color: var(--red); }

.map-embed {
  border-radius: 2px;
  overflow: hidden;
  border: 1px solid var(--gray-700);
}

.rule-card {
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.rule-icon { font-size: 1.5rem; }
.rule-card h3 { font-size: 1rem; letter-spacing: 0.04em; }
.rule-card p { font-size: 0.85rem; color: var(--gray-400); line-height: 1.6; }

@media (max-width: 900px) {
  .specs-layout, .contact-layout { grid-template-columns: 1fr; gap: 40px; }
  .spec-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
