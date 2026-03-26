<template>
  <div>
    <div class="manager-header">
      <h2 class="manager-title">Blog Posts</h2>
      <RouterLink to="/admin/blog/new" class="btn btn-primary">+ New Post</RouterLink>
    </div>

    <div v-if="loading" class="spinner"></div>
    <div v-else-if="posts.length === 0" class="empty-state">
      <p>No blog posts yet.</p>
      <RouterLink to="/admin/blog/new" class="btn btn-primary" style="margin-top:16px">Write First Post</RouterLink>
    </div>
    <div v-else class="posts-table">
      <div class="table-header">
        <span>Title</span>
        <span>Category</span>
        <span>Status</span>
        <span>Date</span>
        <span>Actions</span>
      </div>
      <div v-for="post in posts" :key="post.id" class="table-row">
        <span class="post-title">{{ post.title }}</span>
        <span class="text-muted" style="font-size:0.8rem">{{ post.category || '—' }}</span>
        <span>
          <span class="badge" :class="post.published ? '' : 'badge-outline'" style="font-size:0.65rem">
            {{ post.published ? 'Published' : 'Draft' }}
          </span>
        </span>
        <span class="text-muted" style="font-size:0.75rem">{{ formatDate(post.createdAt) }}</span>
        <span class="row-actions">
          <RouterLink :to="`/admin/blog/${post.id}/edit`" class="btn btn-ghost" style="padding:4px 10px;font-size:0.75rem">Edit</RouterLink>
          <a :href="`/blog/${post.id}`" target="_blank" class="btn btn-ghost" style="padding:4px 10px;font-size:0.75rem">View</a>
          <button class="btn btn-ghost text-red" style="padding:4px 10px;font-size:0.75rem" @click="confirmDelete(post)">Delete</button>
        </span>
      </div>
    </div>

    <!-- Delete confirm modal -->
    <Teleport to="body">
      <div v-if="deletingPost" class="modal-overlay" @click.self="deletingPost = null">
        <div class="modal">
          <h3>Delete Post?</h3>
          <p>Are you sure you want to delete <strong>{{ deletingPost.title }}</strong>? This cannot be undone.</p>
          <div class="modal-actions">
            <button class="btn btn-outline" @click="deletingPost = null">Cancel</button>
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
import { ref, onMounted } from 'vue'
import { getBlogPosts, deleteBlogPost } from '@/firebase/services'

const posts = ref([])
const loading = ref(true)
const deletingPost = ref(null)
const deleteLoading = ref(false)

onMounted(async () => {
  try { posts.value = await getBlogPosts(false) } catch { /* empty */ }
  loading.value = false
})

const formatDate = (ts) => {
  if (!ts) return '—'
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const confirmDelete = (post) => { deletingPost.value = post }
const doDelete = async () => {
  deleteLoading.value = true
  try {
    await deleteBlogPost(deletingPost.value.id)
    posts.value = posts.value.filter(p => p.id !== deletingPost.value.id)
    deletingPost.value = null
  } catch (e) {
    alert('Delete failed: ' + e.message)
  }
  deleteLoading.value = false
}
</script>

<style scoped>
.manager-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}
.manager-title { font-size: 1.2rem; letter-spacing: 0.06em; }

.posts-table {
  border: 1px solid var(--gray-700);
  border-radius: 2px;
  overflow: hidden;
}
.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 100px 120px 200px;
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
  grid-template-columns: 2fr 1fr 100px 120px 200px;
  gap: 16px;
  align-items: center;
  padding: 14px 20px;
  border-top: 1px solid var(--gray-800);
  transition: background 0.15s;
}
.table-row:hover { background: var(--gray-800); }
.post-title { font-size: 0.9rem; font-weight: 500; }
.row-actions { display: flex; gap: 4px; justify-content: flex-end; }

.empty-state {
  text-align: center;
  padding: 64px;
  border: 1px dashed var(--gray-700);
  border-radius: 2px;
  color: var(--gray-400);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}
.modal {
  background: var(--gray-900);
  border: 1px solid var(--gray-600);
  border-radius: 2px;
  padding: 32px;
  max-width: 420px;
  width: 90%;
}
.modal h3 { font-size: 1.2rem; margin-bottom: 12px; }
.modal p { font-size: 0.9rem; color: var(--gray-200); margin-bottom: 24px; }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; }

@media (max-width: 900px) {
  .table-header, .table-row {
    grid-template-columns: 1fr 80px;
    grid-template-rows: auto auto;
  }
  .table-header span:not(:first-child):not(:last-child),
  .table-row span:not(:first-child):not(:last-child) { display: none; }
}
</style>
