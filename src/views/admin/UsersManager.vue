<template>
  <div>
    <div class="manager-header">
      <div>
        <h2 class="manager-title">Admin Users</h2>
        <p class="text-muted" style="font-size:0.8rem;margin-top:4px">Only superadmins can manage admin accounts.</p>
      </div>
      <button class="btn btn-primary" @click="showForm = true">+ Add Admin</button>
    </div>

    <div v-if="loading" class="spinner"></div>
    <div v-else class="users-table">
      <div class="table-header">
        <span>Name / Email</span>
        <span>Role</span>
        <span>Added</span>
        <span>Actions</span>
      </div>
      <div v-for="user in users" :key="user.id" class="table-row">
        <div class="user-info">
          <span class="user-name">{{ user.name || '—' }}</span>
          <span class="user-email text-mono text-muted">{{ user.email }}</span>
        </div>
        <span>
          <span class="badge" :class="user.role === 'superadmin' ? 'badge-yellow' : 'badge-outline'" style="font-size:0.65rem">
            {{ user.role || 'admin' }}
          </span>
        </span>
        <span class="text-muted" style="font-size:0.75rem">{{ formatDate(user.createdAt) }}</span>
        <span class="row-actions">
          <button
            v-if="user.id !== auth.user?.uid"
            class="btn btn-ghost text-red"
            style="padding:4px 10px;font-size:0.75rem"
            @click="confirmDelete(user)"
          >Remove</button>
          <span v-else class="text-muted" style="font-size:0.75rem">You</span>
        </span>
      </div>
    </div>

    <!-- Add Admin Modal -->
    <Teleport to="body">
      <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal">
          <h3>Add Admin User</h3>
          <p style="font-size:0.82rem;color:var(--gray-400);margin-bottom:20px">
            This creates a new Firebase Auth account and grants admin access to this panel.
          </p>
          <div class="form-fields">
            <div class="form-group">
              <label>Full Name</label>
              <input v-model="form.name" type="text" placeholder="Jane Doe" />
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input v-model="form.email" type="email" placeholder="jane@jrpspeedway.com" required />
            </div>
            <div class="form-group">
              <label>Temporary Password *</label>
              <input v-model="form.password" type="password" placeholder="min. 8 characters" required minlength="8" />
            </div>
            <div class="form-group">
              <label>Role</label>
              <select v-model="form.role">
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>
          </div>
          <div v-if="formError" class="alert" style="margin-top:12px">{{ formError }}</div>
          <div v-if="formSuccess" class="alert alert-success" style="margin-top:12px">{{ formSuccess }}</div>
          <div class="modal-actions">
            <button class="btn btn-outline" @click="closeForm">Cancel</button>
            <button class="btn btn-primary" @click="addAdmin" :disabled="formLoading">
              {{ formLoading ? 'Creating…' : 'Create Admin' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="deletingUser" class="modal-overlay" @click.self="deletingUser = null">
        <div class="modal">
          <h3>Remove Admin?</h3>
          <p>
            Remove <strong>{{ deletingUser.name || deletingUser.email }}</strong> from admin access?
            This removes their admin profile but does not delete their Firebase Auth account.
          </p>
          <div class="modal-actions">
            <button class="btn btn-outline" @click="deletingUser = null">Cancel</button>
            <button class="btn btn-primary" @click="doDelete" :disabled="deleteLoading">
              {{ deleteLoading ? 'Removing…' : 'Remove Access' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { getAdminUsers, deleteAdminUser } from '@/firebase/services'

const auth = useAuthStore()
const users = ref([])
const loading = ref(true)
const showForm = ref(false)
const deletingUser = ref(null)
const formLoading = ref(false)
const deleteLoading = ref(false)
const formError = ref('')
const formSuccess = ref('')

const form = reactive({ name: '', email: '', password: '', role: 'admin' })

onMounted(async () => {
  try { users.value = await getAdminUsers() } catch { /* empty */ }
  loading.value = false
})

const formatDate = (ts) => {
  if (!ts) return '—'
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const closeForm = () => {
  showForm.value = false
  formError.value = ''
  formSuccess.value = ''
  Object.assign(form, { name: '', email: '', password: '', role: 'admin' })
}

const addAdmin = async () => {
  if (!form.email || !form.password) { formError.value = 'Email and password are required.'; return }
  formLoading.value = true
  formError.value = ''
  formSuccess.value = ''
  try {
    await auth.createAdmin(form.email, form.password, { name: form.name, role: form.role })
    formSuccess.value = `Admin account created for ${form.email}. They can now log in.`
    users.value = await getAdminUsers()
    Object.assign(form, { name: '', email: '', password: '', role: 'admin' })
  } catch (e) {
    formError.value = e.message || 'Failed to create admin.'
  }
  formLoading.value = false
}

const confirmDelete = (user) => { deletingUser.value = user }
const doDelete = async () => {
  deleteLoading.value = true
  try {
    await deleteAdminUser(deletingUser.value.id)
    users.value = users.value.filter(u => u.id !== deletingUser.value.id)
    deletingUser.value = null
  } catch (e) { alert('Remove failed: ' + e.message) }
  deleteLoading.value = false
}
</script>

<style scoped>
.manager-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
.manager-title { font-size: 1.2rem; letter-spacing: 0.06em; }

.users-table { border: 1px solid var(--gray-700); border-radius: 2px; overflow: hidden; }
.table-header {
  display: grid;
  grid-template-columns: 2fr 120px 140px 120px;
  gap: 16px;
  padding: 12px 20px;
  background: var(--gray-800);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gray-400);
}
.table-row {
  display: grid;
  grid-template-columns: 2fr 120px 140px 120px;
  gap: 16px;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid var(--gray-800);
  transition: background 0.15s;
}
.table-row:hover { background: var(--gray-800); }
.user-info { display: flex; flex-direction: column; gap: 2px; }
.user-name { font-size: 0.9rem; font-weight: 500; }
.user-email { font-size: 0.72rem; }
.row-actions { display: flex; gap: 4px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 20px; }
.modal { background: var(--gray-900); border: 1px solid var(--gray-600); border-radius: 2px; padding: 32px; max-width: 440px; width: 100%; }
.modal h3 { font-size: 1.2rem; margin-bottom: 8px; }
.modal p { font-size: 0.9rem; color: var(--gray-200); margin-bottom: 16px; }
.form-fields { display: flex; flex-direction: column; gap: 14px; }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; }
</style>
