<template>
  <main>
    <div class="page-hero">
      <div class="container">
        <p class="page-hero-eyebrow">// EVENTS CALENDAR</p>
        <h1>Upcoming Events</h1>
        <p>Races, arrive-and-drives, league rounds, and special events at JRP Speedway.</p>
      </div>
    </div>

    <section class="section">
      <div class="container">

        <!-- Filter tabs -->
        <div class="filter-tabs">
          <button
            v-for="tab in tabs"
            :key="tab"
            class="filter-tab"
            :class="{ active: activeTab === tab }"
            @click="activeTab = tab"
          >{{ tab }}</button>
        </div>

        <div v-if="loading" class="spinner"></div>
        <div v-else-if="filteredEvents.length === 0" class="empty-state">
          <span style="font-size:2rem;display:block;margin-bottom:12px">🏁</span>
          <p>No events found. Check back soon for the next race!</p>
        </div>
        <div v-else class="events-list">
          <div v-for="evt in filteredEvents" :key="evt.id" class="event-row card">
            <div class="event-date-block">
              <span class="ev-month">{{ formatMonth(evt.eventDate) }}</span>
              <span class="ev-day">{{ formatDay(evt.eventDate) }}</span>
              <span class="ev-year">{{ formatYear(evt.eventDate) }}</span>
            </div>
            <div class="event-body">
              <div class="event-meta">
                <span class="badge" :class="badgeClass(evt.type)">{{ evt.type || 'Event' }}</span>
                <span v-if="evt.time" class="event-time">🕐 {{ evt.time }}</span>
                <span v-if="evt.location" class="event-time">📍 {{ evt.location }}</span>
              </div>
              <h3 class="event-title">{{ evt.title }}</h3>
              <p class="event-desc">{{ evt.description }}</p>
            </div>
            <div class="event-actions">
              <span v-if="isPast(evt.eventDate)" class="badge badge-outline" style="color:var(--gray-400);border-color:var(--gray-600)">Past</span>
              <a v-else-if="evt.registrationUrl" :href="evt.registrationUrl" target="_blank" rel="noopener" class="btn btn-primary">
                Register
              </a>
              <div v-if="evt.price" class="event-price">${{ evt.price }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to action -->
    <section class="section" style="background:var(--off-white);border-top:1px solid var(--gray-700)">
      <div class="container text-center">
        <div class="accent-line" style="margin:0 auto 16px"></div>
        <h2 class="section-title">Want to Host an Event?</h2>
        <p style="color:var(--gray-200);margin-bottom:28px;max-width:480px;margin-left:auto;margin-right:auto">
          We offer full track hire for private competitions, corporate events, and club race days.
        </p>
        <a href="mailto:events@jrpspeedway.com" class="btn btn-primary">Contact Us</a>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getEvents } from '@/firebase/services'

const events = ref([])
const loading = ref(true)
const activeTab = ref('All')
const tabs = ['All', 'Race', 'Arrive & Drive', 'League', 'Special']

onMounted(async () => {
  try {
    events.value = await getEvents()
  } catch { /* empty */ }
  loading.value = false
})

const filteredEvents = computed(() => {
  if (activeTab.value === 'All') return events.value
  return events.value.filter(e => e.type === activeTab.value)
})

const formatMonth = (ts) => {
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('en', { month: 'short' }).toUpperCase()
}
const formatDay = (ts) => {
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.getDate()
}
const formatYear = (ts) => {
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.getFullYear()
}
const isPast = (ts) => {
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d < new Date()
}
const badgeClass = (type) => {
  const map = { Race: '', League: 'badge-yellow', 'Special': 'badge-outline' }
  return map[type] || 'badge-outline'
}
</script>

<style scoped>
.filter-tabs {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 36px;
  border-bottom: 1px solid var(--gray-700);
  padding-bottom: 0;
}
.filter-tab {
  background: none;
  border: none;
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gray-400);
  padding: 10px 16px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  margin-bottom: -1px;
  transition: var(--transition);
}
.filter-tab:hover { color: var(--white); }
.filter-tab.active { color: var(--blue); border-bottom-color: var(--blue); }

.events-list { display: flex; flex-direction: column; gap: 16px; }
.event-row {
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 24px;
}
.event-date-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--off-white);
  border: 1px solid var(--gray-700);
  padding: 12px 16px;
  border-radius: 2px;
  min-width: 64px;
  text-align: center;
}
.ev-month {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  color: var(--blue);
}
.ev-day {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 900;
  line-height: 1;
}
.ev-year {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--gray-400);
  margin-top: 2px;
}
.event-body { flex: 1; }
.event-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
.event-time {
  font-size: 0.75rem;
  color: var(--gray-400);
  font-family: var(--font-mono);
}
.event-title { font-size: 1.1rem; letter-spacing: 0.03em; margin-bottom: 6px; }
.event-desc { font-size: 0.85rem; color: var(--gray-400); line-height: 1.6; }
.event-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
.event-price {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 900;
  color: var(--blue);
}
.empty-state {
  text-align: center;
  padding: 64px 24px;
  border: 1px dashed var(--gray-700);
  border-radius: 2px;
  color: var(--gray-400);
}

@media (max-width: 640px) {
  .event-row { flex-direction: column; align-items: flex-start; gap: 16px; }
  .event-actions { align-items: flex-start; }
}
</style>
