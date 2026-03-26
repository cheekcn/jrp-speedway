<template>
  <div class="editor-page">
    <div class="editor-topbar">
      <RouterLink to="/admin/blog" class="back-btn">← All Posts</RouterLink>
      <div class="editor-actions">
        <button class="btn btn-outline" @click="save(false)" :disabled="saving">
          {{ saving && !publishing ? 'Saving…' : 'Save Draft' }}
        </button>
        <button class="btn btn-primary" @click="save(true)" :disabled="saving">
          {{ publishing ? 'Publishing…' : (form.published ? 'Update' : 'Publish') }}
        </button>
      </div>
    </div>

    <div v-if="loadingPost" class="spinner"></div>
    <div v-else class="editor-layout">
      <!-- Main editing area -->
      <div class="editor-main">
        <input
          v-model="form.title"
          class="title-input"
          placeholder="Post title…"
          type="text"
        />
        <input
          v-model="form.excerpt"
          class="excerpt-input"
          placeholder="Short excerpt (shown in blog listing)…"
          type="text"
        />
        <textarea
          v-model="form.body"
          class="body-input"
          placeholder="Write your post here. Paragraphs separated by blank lines will render correctly."
        ></textarea>
      </div>

      <!-- Sidebar settings -->
      <aside class="editor-sidebar">
        <div v-if="saveMessage" class="alert alert-success" style="margin-bottom:16px">{{ saveMessage }}</div>
        <div v-if="saveError" class="alert" style="margin-bottom:16px">{{ saveError }}</div>

        <div class="sidebar-section">
          <h4>Post Settings</h4>
          <div class="form-group">
            <label>Category</label>
            <select v-model="form.category">
              <option value="">— None —</option>
              <option>Setup Tips</option>
              <option>Race Recap</option>
              <option>Driver Spotlight</option>
              <option>News</option>
              <option>Tech Talk</option>
              <option>Events</option>
            </select>
          </div>
          <div class="form-group">
            <label>Author</label>
            <input v-model="form.author" type="text" placeholder="Author name" />
          </div>
          <div class="form-group">
            <label>Cover Image URL</label>
            <input v-model="form.coverImage" type="url" placeholder="https://…" />
          </div>
          <div v-if="form.coverImage" class="cover-preview">
            <img :src="form.coverImage" alt="Cover preview" />
          </div>
        </div>

        <div class="sidebar-section">
          <h4>Status</h4>
          <label class="toggle-label">
            <input type="checkbox" v-model="form.published" class="toggle-check" />
            <span class="toggle-slider"></span>
            <span>{{ form.published ? 'Published' : 'Draft' }}</span>
          </label>
        </div>

        <div v-if="isEdit" class="sidebar-section">
          <h4>Preview</h4>
          <a :href="`/blog/${postId}`" target="_blank" class="btn btn-outline w-full" style="justify-content:center;font-size:0.8rem">
            Open Post →
          </a>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBlogPost, addBlogPost, updateBlogPost } from '@/firebase/services'

const route = useRoute()
const router = useRouter()

const postId = computed(() => route.params.id)
const isEdit = computed(() => !!postId.value)

const loadingPost = ref(isEdit.value)
const saving = ref(false)
const publishing = ref(false)
const saveMessage = ref('')
const saveError = ref('')

const form = reactive({
  title: '',
  excerpt: '',
  body: '',
  category: '',
  author: '',
  coverImage: '',
  published: false,
})

onMounted(async () => {
  if (isEdit.value) {
    try {
      const post = await getBlogPost(postId.value)
      if (post) Object.assign(form, post)
    } catch { /* not found */ }
    loadingPost.value = false
  }
})

const save = async (publish) => {
  saveMessage.value = ''
  saveError.value = ''
  saving.value = true
  if (publish) publishing.value = true
  try {
    const data = { ...form, published: publish ? true : form.published }
    if (isEdit.value) {
      await updateBlogPost(postId.value, data)
      Object.assign(form, data)
      saveMessage.value = publish ? 'Post published!' : 'Draft saved.'
    } else {
      const newId = await addBlogPost(data)
      saveMessage.value = publish ? 'Post published!' : 'Draft saved.'
      router.replace(`/admin/blog/${newId}/edit`)
    }
  } catch (e) {
    saveError.value = 'Save failed: ' + e.message
  } finally {
    saving.value = false
    publishing.value = false
    setTimeout(() => { saveMessage.value = '' }, 3000)
  }
}
</script>

<style scoped>
.editor-page { display: flex; flex-direction: column; height: 100%; }

.editor-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.back-btn {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--gray-400);
  transition: color 0.15s;
}
.back-btn:hover { color: var(--red); }
.editor-actions { display: flex; gap: 12px; }

.editor-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 32px;
  align-items: start;
}

.editor-main { display: flex; flex-direction: column; gap: 0; }
.title-input {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  background: transparent;
  border: none;
  border-bottom: 2px solid var(--gray-700);
  border-radius: 0;
  padding: 12px 0;
  margin-bottom: 0;
  color: var(--white);
}
.title-input:focus { border-bottom-color: var(--red); box-shadow: none; }
.excerpt-input {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--gray-800);
  border-radius: 0;
  padding: 12px 0;
  color: var(--gray-200);
  font-style: italic;
  font-size: 1rem;
}
.excerpt-input:focus { border-bottom-color: var(--red); box-shadow: none; }
.body-input {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 20px 0;
  font-size: 1rem;
  line-height: 1.8;
  min-height: 480px;
  resize: none;
  color: var(--gray-100);
}
.body-input:focus { box-shadow: none; }

.editor-sidebar {
  position: sticky;
  top: calc(64px + 32px);
}
.sidebar-section {
  background: var(--gray-800);
  border: 1px solid var(--gray-700);
  border-radius: 2px;
  padding: 20px;
  margin-bottom: 16px;
}
.sidebar-section h4 {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--red);
  margin-bottom: 16px;
}
.sidebar-section .form-group { margin-bottom: 12px; }
.sidebar-section .form-group:last-child { margin-bottom: 0; }

.cover-preview {
  margin-top: 8px;
  border-radius: 2px;
  overflow: hidden;
  max-height: 140px;
}
.cover-preview img { width: 100%; height: 140px; object-fit: cover; }

.toggle-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.toggle-check { display: none; }
.toggle-slider {
  width: 40px; height: 22px;
  background: var(--gray-700);
  border-radius: 11px;
  position: relative;
  transition: background 0.2s;
  flex-shrink: 0;
}
.toggle-slider::after {
  content: '';
  position: absolute;
  width: 16px; height: 16px;
  background: white;
  border-radius: 50%;
  top: 3px; left: 3px;
  transition: transform 0.2s;
}
.toggle-check:checked + .toggle-slider { background: var(--red); }
.toggle-check:checked + .toggle-slider::after { transform: translateX(18px); }

@media (max-width: 900px) {
  .editor-layout { grid-template-columns: 1fr; }
  .editor-sidebar { position: static; }
}
</style>
