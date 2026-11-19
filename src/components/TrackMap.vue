<template>
  <figure class="track-map">
    <svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" role="img"
      aria-label="JRP Speedway track layout: four corners including three hairpins, start/finish on the top straight">
      <defs>
        <!-- Background dot grid -->
        <pattern :id="`${uid}-dots`" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.06)" />
        </pattern>
        <radialGradient :id="`${uid}-vignette`" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stop-color="#18181d" />
          <stop offset="100%" stop-color="#08080a" />
        </radialGradient>
        <!-- Asphalt -->
        <linearGradient :id="`${uid}-asphalt`" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#34343b" />
          <stop offset="100%" stop-color="#26262c" />
        </linearGradient>
        <!-- Checkered start/finish -->
        <pattern :id="`${uid}-checker`" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#fff" />
          <rect width="4" height="4" fill="#0a0a0c" />
          <rect x="4" y="4" width="4" height="4" fill="#0a0a0c" />
        </pattern>
        <filter :id="`${uid}-glow`" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter :id="`${uid}-shadow`" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000" flood-opacity="0.7" />
        </filter>
        <path :id="`${uid}-track`" :d="TRACK" />
      </defs>

      <!-- Ground -->
      <rect width="680" height="400" :fill="`url(#${uid}-vignette)`" />
      <rect width="680" height="400" :fill="`url(#${uid}-dots)`" />

      <g transform="translate(0 -10)">
        <!-- Run-off / shadow -->
        <use :href="`#${uid}-track`" class="runoff" :filter="`url(#${uid}-shadow)`" />

        <!-- Kerbs (corners only): white base + red dashes -->
        <path v-for="(c, i) in CORNERS" :key="'kw' + i" :d="c" class="kerb-base" />
        <path v-for="(c, i) in CORNERS" :key="'kr' + i" :d="c" class="kerb-red" />

        <!-- Edge lines + asphalt -->
        <use :href="`#${uid}-track`" class="edge" />
        <use :href="`#${uid}-track`" class="asphalt" :stroke="`url(#${uid}-asphalt)`" />

        <!-- Centre line -->
        <use :href="`#${uid}-track`" class="centre" />

        <!-- Direction chevrons (follow the lap direction) -->
        <g class="chevrons">
          <path v-for="(c, i) in CHEVRONS" :key="'ch' + i"
            :transform="`translate(${c.x} ${c.y}) rotate(${c.r})`" d="M-5 -7 L3 0 L-5 7" />
        </g>

        <!-- Start / finish -->
        <rect x="336" y="53" width="8" height="54" :fill="`url(#${uid}-checker)`" />
        <text x="340" y="42" text-anchor="middle" class="sf-label">START / FINISH</text>

        <!-- Animated kart + light trail -->
        <g class="kart-anim">
          <!-- real <path> (not <use>) so pathLength normalises the dash maths -->
          <path :d="TRACK" pathLength="1000" class="trail trail-wide">
            <animate attributeName="stroke-dashoffset" values="90;-910" :dur="LAP" repeatCount="indefinite" />
          </path>
          <path :d="TRACK" pathLength="1000" class="trail trail-core">
            <animate attributeName="stroke-dashoffset" values="50;-950" :dur="LAP" repeatCount="indefinite" />
          </path>
          <g :filter="`url(#${uid}-glow)`">
            <g>
              <rect x="-8" y="-5" width="16" height="10" rx="3" class="kart-body" />
              <rect x="-2" y="-3" width="5" height="6" rx="1.5" class="kart-driver" />
              <animateMotion :dur="LAP" repeatCount="indefinite" rotate="auto">
                <mpath :href="`#${uid}-track`" />
              </animateMotion>
            </g>
          </g>
        </g>

        <!-- Turn numbers -->
        <g v-for="t in TURNS" :key="t.n" class="turn">
          <circle :cx="t.x" :cy="t.y" r="11" />
          <text :x="t.x" :y="t.y + 4" text-anchor="middle">{{ t.n }}</text>
        </g>
      </g>

      <g class="meta" transform="translate(16 386)">
        <text>1/4 MILE · 4 CORNERS</text>
      </g>
    </svg>

    <figcaption class="legend">
      <span><i class="lg-kerb"></i>Kerbs</span>
      <span><i class="lg-sf"></i>Start / Finish</span>
      <span><i class="lg-dir">›</i>Direction</span>
      <span><i class="lg-turn">1</i>Turn</span>
    </figcaption>
  </figure>
</template>

<script setup>
// Geometry of the JRP layout (unchanged from the original diagram).
const TRACK = 'M 120 80 C 80 80, 46 96, 46 130 C 46 164, 46 175, 46 200 C 46 225, 46 236, 46 270 C 46 304, 80 320, 120 320 L 560 320 C 596 320, 616 305, 616 280 C 616 255, 596 244, 560 244 L 260 244 C 240 244, 224 232, 224 214 C 224 206, 224 200, 224 200 C 224 200, 224 194, 224 186 C 224 168, 240 156, 260 156 L 560 156 C 596 156, 616 145, 616 120 C 616 95, 596 80, 560 80 Z'

const CORNERS = [
  'M 120 80 C 80 80, 46 96, 46 130',
  'M 46 270 C 46 304, 80 320, 120 320',
  'M 560 320 C 596 320, 616 305, 616 280 C 616 255, 596 244, 560 244',
  'M 260 244 C 240 244, 224 232, 224 214 L 224 186 C 224 168, 240 156, 260 156',
  'M 560 156 C 596 156, 616 145, 616 120 C 616 95, 596 80, 560 80',
]

// Lap runs along the path: top straight right→left, down the left side,
// bottom straight left→right, then back and forth through the hairpins.
const CHEVRONS = [
  { x: 230, y: 80, r: 180 },
  { x: 46, y: 200, r: 90 },
  { x: 340, y: 320, r: 0 },
  { x: 420, y: 244, r: 180 },
  { x: 420, y: 156, r: 0 },
]

// 4 corners (matches the Track page specs): the two left-hand bends joined by
// the short left straight form one long sweeper (T1), then three hairpins.
const TURNS = [
  { n: 1, x: 24, y: 60 },
  { n: 2, x: 660, y: 282 },
  { n: 3, x: 150, y: 200 },
  { n: 4, x: 660, y: 118 },
]

const LAP = '9s'
const uid = 'tm' + Math.random().toString(36).slice(2, 8)
</script>

<style scoped>
.track-map { margin: 0; }
svg { display: block; width: 100%; height: auto; border-radius: 4px; }

.runoff  { fill: none; stroke: #141418; stroke-width: 74; stroke-linecap: round; stroke-linejoin: round; }
.kerb-base { fill: none; stroke: #f2f2f2; stroke-width: 64; stroke-linecap: butt; stroke-linejoin: round; }
.kerb-red  { fill: none; stroke: var(--primary); stroke-width: 64; stroke-dasharray: 7 7; stroke-linecap: butt; stroke-linejoin: round; }
.edge    { fill: none; stroke: rgba(255,255,255,0.85); stroke-width: 56; stroke-linecap: round; stroke-linejoin: round; }
.asphalt { fill: none; stroke-width: 52; stroke-linecap: round; stroke-linejoin: round; }
.centre  { fill: none; stroke: rgba(255,255,255,0.14); stroke-width: 1.5; stroke-dasharray: 12 10; }

.chevrons path { fill: none; stroke: var(--yellow); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; opacity: 0.85; }

.sf-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.15em;
  fill: var(--yellow);
}

.trail { fill: none; stroke-linecap: round; }
.trail-wide { stroke: rgba(225, 6, 0, 0.35); stroke-width: 10; stroke-dasharray: 90 910; }
.trail-core { stroke: var(--primary-light); stroke-width: 3; stroke-dasharray: 50 950; }
.kart-body { fill: var(--yellow); stroke: #0a0a0c; stroke-width: 1.5; }
.kart-driver { fill: #0a0a0c; }

.turn circle { fill: var(--primary); stroke: #0a0a0c; stroke-width: 2; }
.turn text {
  font-family: var(--font-display);
  font-weight: 900;
  font-style: italic;
  font-size: 13px;
  fill: #fff;
}
.meta text {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.18em;
  fill: var(--gray-400);
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin-top: 14px;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gray-400);
}
.legend span { display: inline-flex; align-items: center; gap: 8px; }
.legend i { display: inline-block; font-style: normal; }
.lg-kerb { width: 18px; height: 6px; background: repeating-linear-gradient(90deg, var(--primary) 0 4px, #f2f2f2 4px 8px); }
.lg-sf   { width: 18px; height: 8px; background: var(--checker) 0 0 / 4px 4px; }
.lg-dir  { color: var(--yellow); font-weight: 700; font-size: 1rem; line-height: 1; }
.lg-turn {
  width: 16px; height: 16px; border-radius: 50%;
  background: var(--primary); color: #fff;
  font-family: var(--font-display); font-weight: 900; font-style: italic;
  font-size: 0.7rem; line-height: 16px; text-align: center; letter-spacing: 0;
}

@media (prefers-reduced-motion: reduce) {
  .kart-anim { display: none; }
}
</style>
