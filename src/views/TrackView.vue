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
            <svg viewBox="0 0 440 360" fill="none" xmlns="http://www.w3.org/2000/svg" class="track-svg">
              <rect width="440" height="360" fill="var(--gray-900)"/>

              <!-- ── TRACK SURFACE ── -->
              <!-- Large outer loop: long top straight, sweeping right-hander, back straight, tight bottom hairpin, front straight -->
              <path d="M 48 235 Q 48 145 72 100 Q 96 55 148 42 L 285 42 Q 355 42 378 100 Q 396 145 393 200 Q 390 235 368 252 Q 346 268 314 265 L 288 263 Q 268 262 258 275 Q 248 288 248 305 Q 248 326 228 333 L 200 335 Q 170 335 155 320 Q 140 305 140 285 Q 140 268 128 256 Q 115 244 94 244 L 68 244 Q 48 240 48 235 Z"
                fill="#252525" stroke="var(--gray-600)" stroke-width="1"/>

              <!-- ── TRACK ROAD (wide stroke = tarmac) ── -->
              <!-- Outer perimeter loop -->
              <path d="M 48 235 Q 48 145 72 100 Q 96 55 148 42 L 285 42 Q 355 42 378 100 Q 396 145 393 200 Q 390 235 368 252 Q 346 268 314 265 L 288 263"
                stroke="var(--gray-700)" stroke-width="26" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              <!-- Infield S-bend entry: peel off back straight into infield -->
              <path d="M 314 265 L 288 263 Q 268 261 258 248 Q 248 234 258 222 L 274 212 Q 292 202 290 186 Q 288 170 272 163 L 212 158 Q 192 156 182 142 Q 172 128 180 114 L 194 104 Q 210 94 208 78 L 206 60"
                stroke="var(--gray-700)" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              <!-- Bottom hairpin and return -->
              <path d="M 288 263 Q 268 262 258 275 Q 248 288 248 305 Q 248 326 228 333 L 200 335 Q 170 335 155 320 Q 140 305 140 285 Q 140 268 128 256 Q 115 244 94 244 L 68 244 Q 48 240 48 235"
                stroke="var(--gray-700)" stroke-width="26" fill="none" stroke-linecap="round" stroke-linejoin="round"/>

              <!-- ── INFIELD ROAD MARKINGS (white edge lines) ── -->
              <path d="M 314 265 L 288 263 Q 268 261 258 248 Q 248 234 258 222 L 274 212 Q 292 202 290 186 Q 288 170 272 163 L 212 158 Q 192 156 182 142 Q 172 128 180 114 L 194 104 Q 210 94 208 78 L 206 60"
                stroke="rgba(255,255,255,0.06)" stroke-width="22" fill="none" stroke-linecap="round"/>

              <!-- ── RACING LINE (dashed red centerline) ── -->
              <path d="M 48 235 Q 48 145 72 100 Q 96 55 148 42 L 285 42 Q 355 42 378 100 Q 396 145 393 200 Q 390 235 368 252 Q 346 268 314 265 L 288 263 Q 268 261 258 248 Q 248 234 258 222 L 274 212 Q 292 202 290 186 Q 288 170 272 163 L 212 158 Q 192 156 182 142 Q 172 128 180 114 L 194 104 Q 210 94 208 78"
                stroke="var(--red)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.7" stroke-dasharray="7 5"/>
              <path d="M 288 263 Q 268 262 258 275 Q 248 288 248 305 Q 248 326 228 333 L 200 335 Q 170 335 155 320 Q 140 305 140 285 Q 140 268 128 256 Q 115 244 94 244 L 68 244 Q 48 240 48 235"
                stroke="var(--red)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.7" stroke-dasharray="7 5"/>

              <!-- ── START / FINISH LINE ── -->
              <line x1="48" y1="210" x2="48" y2="240" stroke="var(--yellow)" stroke-width="3.5"/>
              <text x="8" y="222" fill="var(--yellow)" font-size="7.5" font-family="monospace" font-weight="bold">S/F</text>

              <!-- ── DIRECTION ARROWS ── -->
              <text x="205" y="40" fill="var(--red)" font-size="12" opacity="0.9">▶</text>
              <text x="396" y="155" fill="var(--red)" font-size="12" opacity="0.9" transform="rotate(95 396 155)">▶</text>
              <text x="196" y="342" fill="var(--red)" font-size="12" opacity="0.9" transform="rotate(190 196 342)">▶</text>
              <text x="50" y="200" fill="var(--red)" font-size="12" opacity="0.9" transform="rotate(280 50 200)">▶</text>

              <!-- ── LABELS ── -->
              <text x="218" y="30" fill="var(--gray-500)" font-size="7.5" font-family="monospace" text-anchor="middle" letter-spacing="1">TOP STRAIGHT</text>
              <text x="400" y="165" fill="var(--gray-500)" font-size="7.5" font-family="monospace" text-anchor="start">T1</text>
              <text x="290" y="195" fill="var(--gray-500)" font-size="7.5" font-family="monospace" text-anchor="start">INFIELD</text>
              <text x="290" y="205" fill="var(--gray-500)" font-size="7.5" font-family="monospace" text-anchor="start">CHICANE</text>
              <text x="196" y="352" fill="var(--gray-500)" font-size="7.5" font-family="monospace" text-anchor="middle" letter-spacing="1">HAIRPIN</text>
              <text x="28" y="185" fill="var(--gray-500)" font-size="7" font-family="monospace" text-anchor="middle">FRONT</text>
              <text x="28" y="195" fill="var(--gray-500)" font-size="7" font-family="monospace" text-anchor="middle">STR.</text>

              <!-- ── PIT LANE ── -->
              <rect x="49" y="162" width="36" height="16" rx="1"
                fill="none" stroke="var(--gray-600)" stroke-width="1" stroke-dasharray="3 2"/>
              <text x="67" y="173" fill="var(--gray-500)" font-size="6.5" font-family="monospace" text-anchor="middle">PITS</text>
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
