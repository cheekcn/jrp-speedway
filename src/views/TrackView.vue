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
            <svg viewBox="0 0 360 260" fill="none" xmlns="http://www.w3.org/2000/svg" class="track-svg">
              <rect width="360" height="260" fill="var(--gray-900)"/>
              <!-- outer -->
              <path d="M 50 130 Q 50 55 135 42 L 255 42 Q 320 42 320 100 L 320 112 Q 320 148 298 160 L 210 172 Q 188 178 182 196 L 182 208 Q 182 230 155 230 L 118 230 Q 72 230 50 195 Z"
                stroke="var(--gray-600)" stroke-width="24" fill="none"/>
              <!-- inner -->
              <path d="M 50 130 Q 50 55 135 42 L 255 42 Q 320 42 320 100 L 320 112 Q 320 148 298 160 L 210 172 Q 188 178 182 196 L 182 208 Q 182 230 155 230 L 118 230 Q 72 230 50 195 Z"
                stroke="var(--red)" stroke-width="3" fill="none" opacity="0.7"/>
              <!-- start/finish line -->
              <line x1="80" y1="130" x2="80" y2="195" stroke="var(--yellow)" stroke-width="2.5"/>
              <!-- corner labels -->
              <text x="135" y="35" fill="var(--gray-400)" font-size="9" font-family="monospace" text-anchor="middle">T1</text>
              <text x="325" y="100" fill="var(--gray-400)" font-size="9" font-family="monospace">T2</text>
              <text x="300" y="168" fill="var(--gray-400)" font-size="9" font-family="monospace">T3</text>
              <text x="185" y="242" fill="var(--gray-400)" font-size="9" font-family="monospace" text-anchor="middle">T4</text>
              <!-- S/F label -->
              <text x="86" y="162" fill="var(--yellow)" font-size="8" font-family="monospace">S/F</text>
              <!-- direction arrow -->
              <text x="165" y="108" fill="var(--red)" font-size="14" opacity="0.8">▶</text>
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
          * Hours subject to change for private events. Check social media for updates.
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
                  <p>1234 Race Track Blvd<br>Tulsa, OK 74101</p>
                </div>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📞</span>
                <div>
                  <strong>Phone</strong>
                  <p><a href="tel:+19185550100">(918) 555-0100</a></p>
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
              <p>1234 Race Track Blvd, Tulsa OK</p>
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
  { value: 'Indoor', label: 'Climate' },
  { value: '12+', label: 'Karts on Track' },
]

const hours = [
  { day: 'Monday', time: 'Closed', note: 'Private Events Available' },
  { day: 'Tuesday', time: '3:00 PM – 10:00 PM' },
  { day: 'Wednesday', time: '3:00 PM – 10:00 PM' },
  { day: 'Thursday', time: '3:00 PM – 10:00 PM' },
  { day: 'Friday', time: '12:00 PM – 12:00 AM' },
  { day: 'Saturday', time: '10:00 AM – 12:00 AM' },
  { day: 'Sunday', time: '11:00 AM – 9:00 PM' },
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

.map-placeholder {
  background: var(--gray-800);
  border: 1px solid var(--gray-700);
  border-radius: 2px;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.map-inner {
  text-align: center;
  color: var(--gray-400);
}
.map-inner span { font-size: 3rem; display: block; margin-bottom: 12px; }
.map-inner p { font-size: 0.9rem; }

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
