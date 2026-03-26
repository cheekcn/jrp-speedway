<template>
  <main>
    <div class="page-hero">
      <div class="container">
        <p class="page-hero-eyebrow">// RENTAL KARTS</p>
        <h1>Book a Session</h1>
        <p>Hop in, strap up, and go. No experience required — just a need for speed.</p>
      </div>
    </div>

    <!-- Kart Types -->
    <section class="section">
      <div class="container">
        <div class="accent-line"></div>
        <h2 class="section-title">Our Rental Fleet</h2>
        <p class="section-subtitle">We run two classes of rental karts to match every skill level.</p>
        <div class="grid-2" style="margin-top:0">
          <div v-for="kart in kartTypes" :key="kart.name" class="kart-card card">
            <div class="kart-header" :style="{ borderTopColor: kart.color }">
              <div class="kart-badge" :style="{ background: kart.color }">{{ kart.tag }}</div>
              <h2>{{ kart.name }}</h2>
              <p class="kart-tagline">{{ kart.tagline }}</p>
            </div>
            <div class="kart-body">
              <ul>
                <li v-for="spec in kart.specs" :key="spec">
                  <span>✓</span>{{ spec }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Rates -->
    <section class="section" style="background:var(--gray-900);border-top:1px solid var(--gray-700)">
      <div class="container">
        <div class="accent-line"></div>
        <h2 class="section-title">Session Rates</h2>
        <div class="rates-grid">
          <div v-for="rate in rates" :key="rate.name" class="rate-card card" :class="{ featured: rate.featured }">
            <div v-if="rate.featured" class="rate-popular">Best Value</div>
            <h3>{{ rate.name }}</h3>
            <div class="rate-price">
              <span class="price-dollar">$</span>
              <span class="price-amount">{{ rate.price }}</span>
              <span class="price-unit">/ {{ rate.unit }}</span>
            </div>
            <p class="rate-desc">{{ rate.desc }}</p>
            <ul class="rate-includes">
              <li v-for="inc in rate.includes" :key="inc">{{ inc }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Group / Private -->
    <section class="section">
      <div class="container">
        <div class="group-layout">
          <div>
            <div class="accent-line"></div>
            <h2 class="section-title">Groups &<br><span class="text-red">Private Events</span></h2>
            <p style="color:var(--gray-200);margin-bottom:24px;line-height:1.7">
              Planning a birthday, corporate outing, bachelor party, or team building event?
              JRP can run exclusive private sessions with the track all to yourself.
            </p>
            <ul class="feature-list">
              <li><span class="check">✓</span>Exclusive track access</li>
              <li><span class="check">✓</span>Dedicated race director</li>
              <li><span class="check">✓</span>Custom race format</li>
              <li><span class="check">✓</span>Trophy for the winner</li>
              <li><span class="check">✓</span>Catering coordination available</li>
            </ul>
            <a href="mailto:events@jrpspeedway.com" class="btn btn-primary" style="margin-top:28px">
              Inquire About Private Events
            </a>
          </div>
          <div class="pkg-cards">
            <div v-for="pkg in groupPackages" :key="pkg.name" class="pkg-card card">
              <span class="pkg-icon">{{ pkg.icon }}</span>
              <h4>{{ pkg.name }}</h4>
              <span class="pkg-price">From ${{ pkg.from }}</span>
              <p>{{ pkg.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section" style="background:var(--gray-900);border-top:1px solid var(--gray-700)">
      <div class="container" style="max-width:760px">
        <div class="accent-line"></div>
        <h2 class="section-title">FAQs</h2>
        <div class="faq-list">
          <div v-for="faq in faqs" :key="faq.q" class="faq-item" :class="{ open: faq.open }" @click="faq.open = !faq.open">
            <div class="faq-q">
              <span>{{ faq.q }}</span>
              <span class="faq-arrow">{{ faq.open ? '−' : '+' }}</span>
            </div>
            <div class="faq-a" v-show="faq.open">{{ faq.a }}</div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { reactive } from 'vue'

const kartTypes = [
  {
    name: 'Junior Kart',
    tag: 'JUNIOR',
    color: '#FFD000',
    tagline: 'For younger drivers and first-timers',
    specs: [
      '54" – 62" height requirement',
      '200cc engine, ~25 mph',
      'Smooth throttle for learning',
      'Ages 8 and up',
      'Helmet included',
    ]
  },
  {
    name: 'Adult / Pro Kart',
    tag: 'ADULT',
    color: '#E8000F',
    tagline: 'Full-power machines for serious drivers',
    specs: [
      '62"+ height, 16+ years old',
      '390cc engine, 45+ mph',
      'Racing-spec bodywork and seat',
      'Transponder timing system',
      'Helmet & neck brace included',
    ]
  }
]

const rates = [
  {
    name: 'Single Session',
    price: '22',
    unit: 'person',
    desc: 'Jump in anytime during open track hours.',
    includes: ['10-minute qualifying + 14-minute race', 'Helmet & safety gear', 'Printed lap times'],
    featured: false
  },
  {
    name: 'Race Package',
    price: '45',
    unit: 'person',
    desc: 'The full experience — three sessions, leaderboard tracking.',
    includes: ['3 sessions (qualifying + 2 races)', 'Helmet & safety gear', 'Printed results sheet', 'Podium photo'],
    featured: true
  },
  {
    name: '10-Session Punch Card',
    price: '180',
    unit: 'card',
    desc: 'Best deal for regulars — use over multiple visits.',
    includes: ['10 single sessions', 'Valid 12 months', 'Transferable', 'Member discount on extras'],
    featured: false
  }
]

const groupPackages = [
  { icon: '🎂', name: 'Birthday Bash', from: 149, desc: 'Up to 8 racers, 2 sessions each' },
  { icon: '💼', name: 'Corporate Race Day', from: 499, desc: 'Full day, up to 20 drivers, trophies' },
  { icon: '🏆', name: 'Full Track Rental', from: 299, desc: 'Exclusive 2-hour track hire' },
]

const faqs = reactive([
  { q: 'Do I need to make a reservation?', a: 'Walk-ins are welcome during open hours, but reservations are recommended on weekends and for groups of 4+.', open: false },
  { q: 'What should I wear?', a: 'Wear comfortable athletic clothing and closed-toe shoes. Long hair must be tied back. Jewelry should be removed.', open: false },
  { q: 'Can kids race?', a: 'Yes! Drivers 54"–62" in height can use our Junior karts. Adult karts require 62"+ and 16+ years old.', open: false },
  { q: 'Do you rent helmets?', a: 'Yes, rental helmets and neck collars are included in every session at no extra charge. You may bring your own SNELL/SA certified helmet.', open: false },
  { q: 'Can I bring spectators?', a: 'Absolutely. Spectators are free. We have a viewing area with seating above the track.', open: false },
])
</script>

<style scoped>
.kart-card { overflow: visible; }
.kart-header {
  padding: 28px 24px 20px;
  border-top: 4px solid var(--red);
}
.kart-badge {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  padding: 3px 10px;
  border-radius: 2px;
  color: var(--black);
  margin-bottom: 12px;
}
.kart-header h2 { font-size: 1.8rem; margin-bottom: 4px; }
.kart-tagline { color: var(--gray-400); font-size: 0.875rem; }
.kart-body { padding: 0 24px 24px; }
.kart-body ul { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
.kart-body li { display: flex; gap: 10px; font-size: 0.9rem; color: var(--gray-200); }
.kart-body li span { color: var(--red); font-weight: 700; }

.rates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-top: 32px;
}
.rate-card { padding: 28px 24px; position: relative; }
.rate-card.featured {
  border-color: var(--red);
  box-shadow: 0 0 0 1px var(--red), 0 12px 40px rgba(232,0,15,0.15);
}
.rate-popular {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--red);
  color: white;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  padding: 3px 14px;
  border-radius: 2px;
  white-space: nowrap;
}
.rate-card h3 {
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}
.rate-price {
  display: flex;
  align-items: baseline;
  gap: 2px;
  margin-bottom: 12px;
}
.price-dollar { color: var(--red); font-family: var(--font-display); font-size: 1.2rem; }
.price-amount { font-family: var(--font-display); font-size: 3rem; font-weight: 900; line-height: 1; }
.price-unit { color: var(--gray-400); font-size: 0.85rem; }
.rate-desc { font-size: 0.85rem; color: var(--gray-400); margin-bottom: 16px; }
.rate-includes { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.rate-includes li {
  font-size: 0.8rem;
  color: var(--gray-200);
  padding-left: 14px;
  position: relative;
}
.rate-includes li::before { content: '—'; position: absolute; left: 0; color: var(--red); }

.group-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: start;
}
.feature-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.feature-list li { display: flex; gap: 10px; font-size: 0.9rem; color: var(--gray-200); }
.check { color: var(--red); font-weight: 700; }
.pkg-cards { display: flex; flex-direction: column; gap: 16px; }
.pkg-card { padding: 20px 24px; display: flex; align-items: center; gap: 16px; }
.pkg-icon { font-size: 1.5rem; }
.pkg-card h4 { font-size: 0.9rem; letter-spacing: 0.05em; margin-bottom: 2px; }
.pkg-price { font-family: var(--font-display); font-size: 1rem; color: var(--red); font-weight: 700; white-space: nowrap; }
.pkg-card p { font-size: 0.8rem; color: var(--gray-400); margin-top: 2px; }

.faq-list { margin-top: 32px; display: flex; flex-direction: column; }
.faq-item {
  border-bottom: 1px solid var(--gray-700);
  cursor: pointer;
}
.faq-q {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  gap: 16px;
}
.faq-arrow {
  font-family: var(--font-mono);
  font-size: 1.2rem;
  color: var(--red);
  flex-shrink: 0;
}
.faq-a {
  padding: 0 0 18px;
  font-size: 0.9rem;
  color: var(--gray-200);
  line-height: 1.7;
}

@media (max-width: 900px) {
  .group-layout { grid-template-columns: 1fr; gap: 40px; }
}
</style>
