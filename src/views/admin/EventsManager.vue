<template>
  <div>
    <div class="manager-header">
      <h2 class="manager-title">Events</h2>
      <button class="btn btn-primary" @click="openForm()">+ Add Event</button>
    </div>

    <div v-if="loading" class="spinner"></div>
    <div v-else-if="events.length === 0" class="empty-state">
      <p>No events yet. Add your first event!</p>
    </div>
    <div v-else class="events-list">
      <div v-for="evt in events" :key="evt.id" class="event-row card">
        <div class="event-date-block">
          <span class="ev-month">{{ formatMonth(evt.eventDate) }}</span>
          <span class="ev-day">{{ formatDay(evt.eventDate) }}</span>
        </div>
        <div class="event-info">
          <span class="badge badge-outline" style="font-size:0.6rem;margin-bottom:6px">{{ evt.type || 'Event' }}</span>
          <h3>{{ evt.title }}</h3>
          <p class="text-muted" style="font-size:0.8rem">{{ evt.description }}</p>
        </div>
        <div class="event-actions">
          <span v-if="evt.price" style="font-family:var(--font-display);color:var(--red);font-weight:900">${{ evt.price }}</span>
          <button class="btn btn-outline" style="padding:6px 14px;font-size:0.75rem" @click="openForm(evt)">Edit</button>
          <button class="btn btn-ghost text-red" style="padding:6px 14px;font-size:0.75rem" @click="confirmDelete(evt)">Delete</button>
        </div>
      </div>
    </div>

    <!-- Event Form Modal -->
    <Teleport to="body">
      <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal large-modal">
          <h3>{{ editingEvent ? 'Edit Event' : 'New Event' }}</h3>
          <div class="form-grid">
            <div class="form-group" style="grid-column:1/-1">
              <label>Event Title *</label>
              <input v-model="form.title" type="text" placeholder="JRP Sprint Race #4" required />
            </div>
            <div class="form-group">
              <label>Event Type</label>
              <select v-model="form.type">
                <option value="">— Select —</option>
                <option>Race</option>
                <option>Arrive & Drive</option>
                <option>League</option>
                <option>Special</option>
              </select>
            </div>
            <div class="form-group">
              <label>Date *</label>
              <input v-model="form.eventDateStr" type="date" required />
            </div>
            <div class="form-group">
              <label>Time</label>
              <input v-model="form.time" type="text" placeholder="9:00 AM – 5:00 PM" />
            </div>
            <div class="form-group">
              <label>Price ($)</label>
              <input v-model="form.price" type="number" min="0" placeholder="0" />
            </div>
            <div class="form-group">
              <label>Location / Venue</label>
              <input v-model="form.location" type="text" placeholder="JRP Speedway" />
            </div>
            <div class="form-group">
              <label>Registration URL</label>
              <input v-model="form.registrationUrl" type="url" placeholder="https://…" />
            </div>
            <div class="form-group" style="grid-column:1/-1">
              <label>Description</label>
              <textarea v-model="form.description" rows="3" placeholder="Brief description of the event…"></textarea>
            </div>
          </div>
          <div v-if="formError" class="alert" style="margin-top:12px">{{ formError }}</div>
          <div class="modal-actions">
            <button class="btn btn-outline" @click="closeForm">Cancel</button>
            <button class="btn btn-primary" @click="saveEvent" :disabled="formLoading">
              {{ formLoading ? 'Saving…' : (editingEvent ? 'Update Event' : 'Add Event') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete confirm -->
      <div v-if="deletingEvent" class="modal-overlay" @click.self="deletingEvent = null">
        <div class="modal">
          <h3>Delete Event?</h3>
          <p>Delete <strong>{{ deletingEvent.title }}</strong>? This cannot be undone.</p>
          <div class="modal-actions">
            <button class="btn btn-outline" @click="deletingEvent = null">Cancel</button>
            <button class="btn btn-primary" @click="doDelete" :disabled="deleteLoading">
              {{ deleteLoading ? 'Deleting…' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getEvents, addEvent, updateEvent, deleteEvent } from '@/firebase/services'
import { Timestamp } from 'firebase/firestore'

const events = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingEvent = ref(null)
const deletingEvent = ref(null)
const formLoading = ref(false)
const deleteLoading = ref(false)
const formError = ref('')

const blankForm = () => ({
  title: '', type: '', eventDateStr: '', time: '',
  price: '', location: 'JRP Speedway', registrationUrl: '', description: ''
})
const form = reactive(blankForm())

onMounted(async () => {
  try { events.value = await getEvents() } catch { /* empty */ }
  loading.value = false
})

const formatMonth = (ts) => {
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('en', { month: 'short' }).toUpperCase()
}
const formatDay = (ts) => {
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.getDate()
}

const openForm = (evt = null) => {
  formError.value = ''
  editingEvent.value = evt ? { id: evt.id } : null
  if (evt) {
    const d = evt.eventDate?.toDate ? evt.eventDate.toDate() : new Date(evt.eventDate)
    // Use UTC date parts to avoid timezone offset shifting the day
    const yyyy = d.getUTCFullYear()
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
    const dd = String(d.getUTCDate()).padStart(2, '0')
    Object.assign(form, {
      title: evt.title || '',
      type: evt.type || '',
      eventDateStr: `${yyyy}-${mm}-${dd}`,
      time: evt.time || '',
      price: evt.price || '',
      location: evt.location || 'JRP Speedway',
      registrationUrl: evt.registrationUrl || '',
      description: evt.description || '',
    })
  } else {
    Object.assign(form, blankForm())
  }
  showForm.value = true
}
const closeForm = () => { showForm.value = false; editingEvent.value = null }

const saveEvent = async () => {
  if (!form.title || !form.eventDateStr) { formError.value = 'Title and date are required.'; return }
  formLoading.value = true
  formError.value = ''
  try {
    // Parse date as local midnight, not UTC midnight, to avoid off-by-one day
    const [year, month, day] = form.eventDateStr.split('-').map(Number)
    const eventDate = Timestamp.fromDate(new Date(year, month - 1, day, 12, 0, 0))
    const data = { ...form, eventDate, eventDateStr: undefined }
    delete data.eventDateStr
    if (editingEvent.value) {
      await updateEvent(editingEvent.value.id, data)
      const idx = events.value.findIndex(e => e.id === editingEvent.value.id)
      if (idx > -1) events.value[idx] = { ...events.value[idx], ...data }
    } else {
      const newId = await addEvent(data)
      events.value.push({ id: newId, ...data })
    }
    closeForm()
  } catch (e) {
    formError.value = 'Save failed: ' + e.message
  }
  formLoading.value = false
}

const confirmDelete = (evt) => { deletingEvent.value = evt }
const doDelete = async () => {
  deleteLoading.value = true
  try {
    await deleteEvent(deletingEvent.value.id)
    events.value = events.value.filter(e => e.id !== deletingEvent.value.id)
    deletingEvent.value = null
  } catch (e) { alert('Delete failed: ' + e.message) }
  deleteLoading.value = false
}
</script>

<style scoped>
.manager-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
.manager-title { font-size: 1.2rem; letter-spacing: 0.06em; }

.events-list { display: flex; flex-direction: column; gap: 12px; }
.event-row { display: flex; align-items: center; gap: 20px; padding: 20px 24px; }
.event-date-block {
  display: flex; flex-direction: column; align-items: center;
  background: var(--red); padding: 8px 12px; border-radius: 2px; min-width: 52px;
}
.ev-month { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.1em; color: rgba(255,255,255,0.8); }
.ev-day { font-family: var(--font-display); font-size: 1.8rem; font-weight: 900; line-height: 1; color: white; }
.event-info { flex: 1; }
.event-info h3 { font-size: 0.95rem; letter-spacing: 0.03em; margin-bottom: 4px; }
.event-actions { display: flex; align-items: center; gap: 8px; }
.empty-state { text-align: center; padding: 64px; border: 1px dashed var(--gray-700); border-radius: 2px; color: var(--gray-400); }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 20px; }
.modal { background: var(--gray-900); border: 1px solid var(--gray-600); border-radius: 2px; padding: 32px; max-width: 420px; width: 100%; }
.large-modal { max-width: 680px; }
.modal h3 { font-size: 1.2rem; margin-bottom: 20px; }
.modal p { font-size: 0.9rem; color: var(--gray-200); margin-bottom: 24px; }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
</style>
