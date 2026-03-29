<template>
  <main>
    <div class="page-hero">
      <div class="container">
        <p class="page-hero-eyebrow">// JRP RACING LEAGUE</p>
        <h1>Compete for<br><span class="text-blue">the Championship</span></h1>
        <p>Points-based competition racing at JRP Speedway. Multiple classes. Real trophies. Real rivals.</p>
      </div>
    </div>

    <!-- League intro -->
    <section class="section">
      <div class="container">
        <div class="league-intro-layout">
          <div>
            <div class="accent-line"></div>
            <h2 class="section-title">What is the<br>JRP League?</h2>
            <p style="color:var(--gray-200);line-height:1.8;margin-bottom:16px">
              The JRP Racing League is an in-house competition series designed to give drivers
              of all experience levels a structured, fair, and exciting championship to compete in.
            </p>
            <p style="color:var(--gray-200);line-height:1.8;margin-bottom:24px">
              Each season consists of multiple rounds with practice, qualifying, heat race, and a final.
              Points are accumulated across the season, culminating in an end-of-year
              championship shootout with trophies awarded to class winners.
            </p>
            <a href="mailto:league@jrpspeedway.com" class="btn btn-primary">Register Interest</a>
          </div>
          <div class="league-highlights">
            <div v-for="h in highlights" :key="h.label" class="highlight-item">
              <span class="h-val">{{ h.val }}</span>
              <span class="h-label">{{ h.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Classes -->
    <section class="section" style="background:var(--off-white);border-top:1px solid var(--gray-700)">
      <div class="container">
        <div class="accent-line"></div>
        <h2 class="section-title">Racing Classes</h2>
        <p class="section-subtitle">Multiple classes ensure fair, competitive racing at every skill level.</p>
        <div class="classes-grid">
          <div v-for="cls in classes" :key="cls.name" class="class-card card">
            <div class="class-color" :style="{ background: cls.color }"></div>
            <div class="class-body">
              <h3>{{ cls.name }}</h3>
              <p class="class-desc">{{ cls.desc }}</p>
              <div class="class-specs">
                <div v-for="spec in cls.specs" :key="spec.k" class="cspec">
                  <span>{{ spec.k }}</span><strong>{{ spec.v }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Format -->
    <section class="section">
      <div class="container">
        <div class="format-layout">
          <div>
            <div class="accent-line"></div>
            <h2 class="section-title">Race Day Format</h2>
            <div class="format-steps">
              <div v-for="(step, i) in steps" :key="step.name" class="step">
                <div class="step-num">{{ i + 1 }}</div>
                <div class="step-content">
                  <h4>{{ step.name }}</h4>
                  <p>{{ step.desc }}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="accent-line"></div>
            <h2 class="section-title">Points System</h2>
            <div class="points-table">
              <div class="pt-header">
                <span>Position</span><span>Points</span>
              </div>
              <div v-for="pt in pointsTable" :key="pt.pos" class="pt-row">
                <span class="pt-pos">
                  <span v-if="pt.pos <= 3" class="trophy">{{ ['🥇','🥈','🥉'][pt.pos-1] }}</span>
                  P{{ pt.pos }}
                </span>
                <span class="pt-pts">{{ pt.pts }}</span>
              </div>
            </div>
            <p style="font-size:0.75rem;color:var(--gray-400);margin-top:12px">
              +1 bonus point for pole position. +1 for fastest lap.
            </p>
          </div>
        </div>
      </div>
    </section>



    <!-- CTA -->
    <section class="section">
      <div class="container text-center">
        <h2 class="section-title" style="margin-bottom:12px">Ready to<br><span class="text-blue">Race?</span></h2>
        <p style="color:var(--gray-200);margin-bottom:28px">
          Register for the upcoming season or show up to our next arrive-and-drive to try it out.
        </p>
        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
          <a href="mailto:info@jrpspeedway.com" class="btn btn-primary">Join the League</a>
          <RouterLink to="/events" class="btn btn-outline">See Event Calendar</RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
const highlights = [
  { val: '8–10', label: 'Rounds per Season' },
  { val: '3', label: 'Racing Classes' },
  { val: '🏆', label: 'Championship Trophy' },
  { val: 'JRP', label: 'In-House Championship' },
]

const classes = [
  {
    name: 'Kid Kart',
    color: '#FFD000',
    desc: 'Entry-level class for the youngest drivers just getting started.',
    specs: [
      { k: 'Kart', v: 'Kid Kart' },
      { k: 'Category', v: 'Junior' },
    ]
  },
  {
    name: 'Junior I',
    color: '#FFD000',
    desc: 'Beginner junior class for developing racers.',
    specs: [
      { k: 'Kart', v: 'Junior' },
      { k: 'Category', v: 'Junior' },
    ]
  },
  {
    name: 'Junior II',
    color: '#4A90D9',
    desc: 'Intermediate junior class for experienced young drivers.',
    specs: [
      { k: 'Kart', v: 'Junior' },
      { k: 'Category', v: 'Junior' },
    ]
  },
  {
    name: 'LO206 Light',
    color: '#E8000F',
    desc: 'Briggs LO206 engine class for lighter senior drivers.',
    specs: [
      { k: 'Engine', v: 'Briggs LO206' },
      { k: 'Category', v: 'Senior' },
    ]
  },
  {
    name: 'LO206 Senior',
    color: '#E8000F',
    desc: 'Briggs LO206 engine class for senior drivers.',
    specs: [
      { k: 'Engine', v: 'Briggs LO206' },
      { k: 'Category', v: 'Senior' },
    ]
  },
  {
    name: 'LO206 Heavy',
    color: '#E8000F',
    desc: 'Briggs LO206 engine class for heavier senior drivers.',
    specs: [
      { k: 'Engine', v: 'Briggs LO206' },
      { k: 'Category', v: 'Senior' },
    ]
  },
]

const steps = [
  { name: 'Practice — Round 1', desc: 'First practice session to get familiar with the track and dial in your setup.' },
  { name: 'Practice — Round 2', desc: 'Second practice session to refine your lines and kart settings before qualifying.' },
  { name: 'Qualifying', desc: 'Timed session to set grid positions for the heat race.' },
  { name: 'Heat Race', desc: 'Points-paying heat race. Results help set the grid for the final.' },
  { name: 'Final Race', desc: 'Championship final. Points awarded. Trophies presented to P1–P3.' },
]

const pointsTable = [
  { pos: 1, pts: 25 },
  { pos: 2, pts: 20 },
  { pos: 3, pts: 16 },
  { pos: 4, pts: 13 },
  { pos: 5, pts: 11 },
  { pos: 6, pts: 9 },
  { pos: 7, pts: 7 },
  { pos: 8, pts: 5 },
  { pos: 9, pts: 3 },
  { pos: 10, pts: 1 },
]
</script>

<style scoped>
.league-intro-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 64px;
  align-items: start;
}
.league-highlights {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--gray-700);
  border: 1px solid var(--gray-700);
  border-radius: 2px;
  overflow: hidden;
}
.highlight-item {
  background: var(--white);
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.h-val { font-family: var(--font-display); font-size: 2rem; font-weight: 900; color: var(--blue); }
.h-label { font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.12em; color: var(--gray-400); text-transform: uppercase; }

.classes-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-top: 32px; }
.class-card { display: flex; overflow: hidden; }
.class-color { width: 6px; flex-shrink: 0; }
.class-body { padding: 24px; flex: 1; }
.class-body h3 { font-size: 1rem; letter-spacing: 0.05em; margin-bottom: 8px; }
.class-desc { font-size: 0.85rem; color: var(--gray-400); margin-bottom: 16px; line-height: 1.6; }
.class-specs { display: flex; flex-direction: column; gap: 6px; }
.cspec { display: flex; justify-content: space-between; font-size: 0.8rem; padding: 6px 0; border-bottom: 1px solid var(--gray-700); }
.cspec span { color: var(--gray-400); }
.cspec strong { color: var(--white); }

.format-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
}
.format-steps { margin-top: 24px; display: flex; flex-direction: column; gap: 0; }
.step {
  display: flex;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid var(--gray-700);
}
.step-num {
  width: 32px; height: 32px;
  background: var(--blue);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 900;
  flex-shrink: 0;
}
.step-content h4 { font-size: 0.95rem; letter-spacing: 0.05em; margin-bottom: 4px; }
.step-content p { font-size: 0.83rem; color: var(--gray-400); }

.points-table { border: 1px solid var(--gray-700); border-radius: 2px; overflow: hidden; margin-top: 24px; }
.pt-header {
  display: flex;
  justify-content: space-between;
  padding: 10px 16px;
  background: var(--gray-700);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gray-400);
}
.pt-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid var(--gray-800);
  font-size: 0.85rem;
}
.pt-row:last-child { border-bottom: none; }
.pt-pos { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); }
.trophy { font-size: 1rem; }
.pt-pts { font-family: var(--font-display); font-size: 1.1rem; font-weight: 900; color: var(--blue); }



@media (max-width: 900px) {
  .league-intro-layout, .format-layout { grid-template-columns: 1fr; gap: 40px; }
  .affiliation-card { flex-direction: column; padding: 32px 24px; }
}
</style>
