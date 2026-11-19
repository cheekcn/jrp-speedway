<template>
  <div>
    <div class="manager-header">
      <div>
        <h2 class="manager-title">Hours of Operation</h2>
        <p class="text-muted sub">Shown on the Track page and in the site footer.</p>
      </div>
      <div class="header-actions">
        <button v-if="dirty" class="btn btn-ghost" @click="discard" :disabled="saving">Discard</button>
        <button class="btn btn-primary" @click="save" :disabled="!dirty || saving || hasErrors">
          {{ saving ? 'Saving…' : 'Save Hours' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="spinner"></div>
    <template v-else>
      <div v-if="message" class="alert" :class="messageType === 'success' ? 'alert-success' : 'alert-warning'" style="margin-bottom:20px">
        {{ message }}
      </div>

      <div class="hours-layout">
        <!-- Editor -->
        <div class="editor">
          <div class="card panel">
            <div class="form-grid">
              <div class="form-group">
                <label>Season label <span class="optional">optional</span></label>
                <input v-model="form.season" type="text" maxlength="60" placeholder="e.g. Winter Hours (Nov – Feb)" />
              </div>
              <div class="form-group">
                <label>Footnote <span class="optional">optional</span></label>
                <input v-model="form.footnote" type="text" maxlength="200" placeholder="Hours subject to change…" />
              </div>
            </div>
          </div>

          <div class="card panel days">
            <div v-for="(d, i) in form.days" :key="d.day" class="day-row" :class="{ closed: d.closed }">
              <div class="day-name">{{ d.day }}</div>

              <button type="button" class="status-toggle" :class="d.closed ? 'is-closed' : 'is-open'"
                @click="d.closed = !d.closed" :aria-pressed="!d.closed" :title="d.closed ? 'Mark as open' : 'Mark as closed'">
                <span class="dot"></span>{{ d.closed ? 'Closed' : 'Open' }}
              </button>

              <div class="times">
                <template v-if="!d.closed">
                  <input v-model="d.open" type="time" step="900" :aria-label="`${d.day} opening time`" />
                  <span class="to">to</span>
                  <input v-model="d.close" type="time" step="900" :aria-label="`${d.day} closing time`" />
                </template>
                <span v-else class="closed-text">Closed all day</span>
              </div>

              <input v-model="d.note" type="text" class="note" maxlength="60" placeholder="Note (optional)"
                :aria-label="`${d.day} note`" />

              <button v-if="!d.closed" type="button" class="btn btn-ghost copy-btn" @click="copyToAll(i)"
                title="Copy these times to every open day">Copy to all</button>
              <span v-else class="copy-btn"></span>

              <p v-if="rowError(d)" class="row-error">{{ rowError(d) }}</p>
            </div>
          </div>

          <p v-if="lastUpdated" class="text-muted updated">
            Last saved {{ lastUpdated }}<span v-if="updatedBy"> by {{ updatedBy }}</span>
          </p>
        </div>

        <!-- Live preview -->
        <aside class="preview card panel">
          <div class="preview-label">Preview</div>
          <h4>Footer</h4>
          <p v-if="form.season" class="pv-season">{{ form.season }}</p>
          <div v-for="g in previewGroups" :key="g.label" class="pv-row">
            <span>{{ g.label }}</span><span>{{ g.time }}</span>
          </div>

          <h4 style="margin-top:24px">Track page</h4>
          <div v-for="d in form.days" :key="'p' + d.day" class="pv-row">
            <span>{{ d.day }}</span>
            <span :class="{ muted: d.closed }">{{ formatDayHours(d) }}</span>
          </div>
          <p v-if="form.footnote" class="pv-foot">* {{ form.footnote }}</p>
        </aside>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { getHours, saveHours } from '@/firebase/services'
import { normalizeHours, setHours, formatDayHours, groupHours } from '@/composables/useHours'
import { useAuthStore } from '@/store/auth'

const auth = useAuthStore()
const loading = ref(true)
const saving = ref(false)
const message = ref('')
const messageType = ref('success')
const updatedAt = ref(null)
const updatedBy = ref('')

const form = reactive(normalizeHours())
let savedSnapshot = ''

const snapshot = () => JSON.stringify({ season: form.season, footnote: form.footnote, days: form.days })
const dirty = computed(() => snapshot() !== savedSnapshot)

const rowError = (d) =>
  !d.closed && d.open && d.close && d.open >= d.close ? 'Closing time must be after opening time.'
  : !d.closed && (!d.open || !d.close) ? 'Enter both times.' : ''
const hasErrors = computed(() => form.days.some(rowError))

const previewGroups = computed(() => groupHours(form.days))

const lastUpdated = computed(() => {
  const ts = updatedAt.value
  if (!ts) return ''
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
})

const applyData = (data) => {
  const n = normalizeHours(data || {})
  form.season = n.season
  form.footnote = n.footnote
  form.days = n.days
  updatedAt.value = data?.updatedAt || null
  updatedBy.value = data?.updatedBy || ''
  savedSnapshot = snapshot()
}

onMounted(async () => {
  try {
    applyData(await getHours())
  } catch (e) {
    applyData(null)
    messageType.value = 'warning'
    message.value = 'Could not load saved hours (' + e.message + '). Showing the defaults.'
  }
  loading.value = false
})

const copyToAll = (i) => {
  const src = form.days[i]
  form.days.forEach(d => { if (!d.closed) { d.open = src.open; d.close = src.close } })
}

const discard = () => {
  const saved = JSON.parse(savedSnapshot)
  form.season = saved.season
  form.footnote = saved.footnote
  form.days = saved.days
  message.value = ''
}

const save = async () => {
  if (hasErrors.value) return
  saving.value = true
  message.value = ''
  try {
    const data = {
      season: form.season.trim(),
      footnote: form.footnote.trim(),
      days: form.days.map(d => ({ ...d, note: d.note.trim() })),
      updatedBy: auth.adminProfile?.email || auth.user?.email || '',
    }
    await saveHours(data)
    setHours({ ...data, updatedAt: new Date() })   // update the live site state immediately
    applyData({ ...data, updatedAt: new Date() })
    messageType.value = 'success'
    message.value = 'Hours saved. The website now shows the new hours.'
  } catch (e) {
    messageType.value = 'warning'
    message.value = e.code === 'permission-denied'
      ? 'Save was blocked by Firestore security rules. The updated firestore.rules file needs to be deployed (see setup notes).'
      : 'Save failed: ' + e.message
  }
  saving.value = false
}

onBeforeRouteLeave(() => {
  if (dirty.value && !saving.value) {
    return window.confirm('You have unsaved changes to the hours. Leave without saving?')
  }
})
</script>

<style scoped>
.manager-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.manager-title { font-size: 1.2rem; letter-spacing: 0.06em; }
.sub { font-size: 0.85rem; margin-top: 4px; }
.header-actions { display: flex; gap: 8px; align-items: center; }

.hours-layout { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 24px; align-items: start; }
.editor { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.panel { padding: 20px 24px; }
.panel:hover { transform: none; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.optional { text-transform: none; letter-spacing: 0; font-weight: 400; color: var(--gray-400); opacity: 0.7; margin-left: 4px; }

.days { padding-top: 8px; padding-bottom: 8px; }
.day-row {
  display: grid;
  grid-template-columns: 110px 100px 290px minmax(120px, 1fr) 96px;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--gray-700);
}
.day-row:last-child { border-bottom: none; }
.day-name { font-family: var(--font-display); font-weight: 800; font-size: 1rem; letter-spacing: 0.04em; text-transform: uppercase; }
.day-row.closed .day-name { color: var(--gray-400); }

.status-toggle {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 7px 12px;
  font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase;
  border-radius: 999px; border: 1px solid var(--gray-600);
  background: var(--surface-alt); color: var(--gray-200);
  cursor: pointer; transition: var(--transition);
}
.status-toggle .dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
.status-toggle.is-open { color: #2BE38B; border-color: rgba(43, 227, 139, 0.45); background: rgba(43, 227, 139, 0.08); }
.status-toggle.is-closed { color: var(--primary-bright); border-color: rgba(225, 6, 0, 0.45); background: var(--primary-tint); }

.times { display: flex; align-items: center; gap: 8px; }
.times input { width: auto; flex: 1; min-width: 0; }
.to { font-size: 0.8rem; color: var(--gray-400); }
.closed-text { font-size: 0.85rem; color: var(--gray-400); font-style: italic; }
.note { font-size: 0.85rem; }
.copy-btn { font-size: 0.72rem; padding: 6px 8px; white-space: nowrap; }
.row-error { grid-column: 1 / -1; font-size: 0.8rem; color: var(--primary-bright); margin-top: -4px; }
.updated { font-size: 0.8rem; }

.preview { position: sticky; top: 20px; }
.preview-label {
  font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--primary-bright); margin-bottom: 14px;
}
.preview h4 { font-size: 0.75rem; letter-spacing: 0.15em; color: var(--gray-400); margin-bottom: 8px; }
.pv-season { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--yellow); margin-bottom: 6px; }
.pv-row { display: flex; justify-content: space-between; gap: 12px; font-size: 0.8rem; color: var(--gray-400); padding: 5px 0; border-bottom: 1px solid var(--gray-800); }
.pv-row span:last-child { color: var(--gray-100); text-align: right; }
.pv-row span.muted { color: var(--gray-400); }
.pv-foot { font-size: 0.75rem; color: var(--gray-400); margin-top: 12px; line-height: 1.5; }

@media (max-width: 1200px) {
  .hours-layout { grid-template-columns: 1fr; }
  .preview { position: static; }
}
@media (max-width: 760px) {
  .form-grid { grid-template-columns: 1fr; }
  .day-row { grid-template-columns: 1fr auto; }
  .times, .note { grid-column: 1 / -1; }
  .copy-btn { grid-column: 1 / -1; justify-self: start; }
}
</style>
