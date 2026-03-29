<template>
  <div class="editor-page">
    <div class="editor-topbar">
      <RouterLink to="/admin/blog" class="back-btn">← All Posts</RouterLink>
      <div class="editor-actions">
        <button class="btn btn-outline" @click="save(false)" :disabled="saving || uploadProgress !== null">
          {{ saving && !publishing ? 'Saving…' : 'Save Draft' }}
        </button>
        <button class="btn btn-primary" @click="save(true)" :disabled="saving || uploadProgress !== null">
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

          <!-- Cover image upload -->
          <div class="form-group">
            <label>Cover Image</label>
            <div
              class="cover-upload-area"
              :class="{ 'has-image': imagePreview || form.coverImage }"
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="handleDrop"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                style="display:none"
                @change="handleFileChange"
              />
              <div v-if="imagePreview || form.coverImage" class="cover-preview">
                <img :src="imagePreview || form.coverImage" alt="Cover preview" />
                <button type="button" class="cover-remove-btn" @click.stop="removeImage" title="Remove image">✕</button>
              </div>
              <div v-else class="cover-upload-prompt">
                <span style="font-size:1.4rem">📷</span>
                <span class="upload-text">Click or drag & drop</span>
                <span class="upload-sub">JPG, PNG, WEBP — max 5MB</span>
              </div>
            </div>
            <div v-if="uploadProgress !== null" class="upload-progress-wrap">
              <div class="upload-progress-bar" :style="{ width: uploadProgress + '%' }"></div>
              <span class="upload-progress-label">
                {{ uploadProgress < 100 ? `Uploading ${uploadProgress}%…` : 'Done!' }}
              </span>
            </div>
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
import { storage } from '@/firebase/config'
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'

const route = useRoute()
const router = useRouter()

const postId = computed(() => route.params.id)
const isEdit = computed(() => !!postId.value)

const loadingPost = ref(isEdit.value)
const saving = ref(false)
const publishing = ref(false)
const saveMessage = ref('')
const saveError = ref('')

// Image state
const fileInput = ref(null)
const selectedFile = ref(null)
const imagePreview = ref(null)
const uploadProgress = ref(null)

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

// ── Image handling ────────────────────────────────────────────────────────
const triggerFileInput = () => {
  if (!imagePreview.value && !form.coverImage) fileInput.value?.click()
}

const handleFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file) setFile(file)
}

const handleDrop = (e) => {
  const file = e.dataTransfer.files?.[0]
  if (file && file.type.startsWith('image/')) setFile(file)
}

const setFile = (file) => {
  if (file.size > 5 * 1024 * 1024) {
    saveError.value = 'Image must be under 5MB.'
    return
  }
  selectedFile.value = file
  imagePreview.value = URL.createObjectURL(file)
  form.coverImage = ''
}

const removeImage = () => {
  selectedFile.value = null
  imagePreview.value = null
  form.coverImage = ''
  if (fileInput.value) fileInput.value.value = ''
}

const uploadImage = (file, id) => {
  return new Promise((resolve, reject) => {
    const ext = file.name.split('.').pop().toLowerCase()
    const path = `blog/${id}_${Date.now()}.${ext}`
    const sRef = storageRef(storage, path)
    const task = uploadBytesResumable(sRef, file)

    task.on(
      'state_changed',
      (snap) => {
        uploadProgress.value = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
      },
      (err) => { uploadProgress.value = null; reject(err) },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        uploadProgress.value = null
        resolve(url)
      }
    )
  })
}

// ── Save ──────────────────────────────────────────────────────────────────
const save = async (publish) => {
  saveMessage.value = ''
  saveError.value = ''
  saving.value = true
  if (publish) publishing.value = true

  try {
    let coverImage = form.coverImage

    // Upload new image if selected
    if (selectedFile.value) {
      const tempId = isEdit.value ? postId.value : `post_${Date.now()}`
      coverImage = await uploadImage(selectedFile.value, tempId)
      selectedFile.value = null
      imagePreview.value = null
      form.coverImage = coverImage
    }

    const data = { ...form, coverImage, published: publish ? true : form.published }

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
    uploadProgress.value = null
  } finally {
    saving.value = false
    publishing.value = false
    setTimeout(() => { saveMessage.value = '' }, 3000)
  }
}
</script>

<style scoped>
.editor-page { display: flex; flex-direction: column; height: 100%; background: var(--white); padding: 0; }

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
.back-btn:hover { color: var(--blue); }
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
  border-bottom: 2px solid var(--gray-600);
  border-radius: 0;
  padding: 12px 0;
  margin-bottom: 0;
  color: var(--black);
}
.title-input:focus { border-bottom-color: var(--blue); box-shadow: none; }
.excerpt-input {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--gray-600);
  border-radius: 0;
  padding: 12px 0;
  color: var(--black);
  font-style: italic;
  font-size: 1rem;
}
.excerpt-input:focus { border-bottom-color: var(--blue); box-shadow: none; }
.body-input {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 20px 0;
  font-size: 1rem;
  line-height: 1.8;
  min-height: 480px;
  resize: none;
  color: var(--black);
  background: var(--white);
}
.body-input:focus { box-shadow: none; }

.editor-sidebar {
  position: sticky;
  top: calc(64px + 32px);
}
.sidebar-section {
  background: var(--off-white);
  border: 1px solid var(--gray-700);
  border-radius: var(--radius);
  padding: 20px;
  margin-bottom: 16px;
}
.sidebar-section h4 {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--blue);
  margin-bottom: 16px;
}
.sidebar-section .form-group { margin-bottom: 12px; }
.sidebar-section .form-group:last-child { margin-bottom: 0; }

/* Cover image upload */
.cover-upload-area {
  border: 2px dashed var(--gray-600);
  border-radius: var(--radius);
  cursor: pointer;
  overflow: hidden;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--white);
  transition: border-color 0.15s, background 0.15s;
}
.cover-upload-area:not(.has-image):hover {
  border-color: var(--blue);
  background: var(--blue-pale);
}
.cover-upload-area.has-image { cursor: default; border-style: solid; border-color: var(--gray-600); }

.cover-upload-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 20px 16px;
  text-align: center;
  pointer-events: none;
}
.upload-text { font-size: 0.8rem; font-weight: 600; color: var(--black); }
.upload-sub { font-size: 0.7rem; color: var(--gray-400); }

.cover-preview {
  position: relative;
  width: 100%;
  height: 140px;
}
.cover-preview img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cover-remove-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.cover-remove-btn:hover { background: rgba(232,0,15,0.85); }

.upload-progress-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}
.upload-progress-bar {
  height: 3px;
  background: var(--blue);
  border-radius: 2px;
  transition: width 0.2s ease;
  flex: 1;
}
.upload-progress-label { font-size: 0.7rem; color: var(--gray-400); white-space: nowrap; }

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
  background: var(--gray-600);
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
.toggle-check:checked + .toggle-slider { background: var(--blue); }
.toggle-check:checked + .toggle-slider::after { transform: translateX(18px); }

@media (max-width: 900px) {
  .editor-layout { grid-template-columns: 1fr; }
  .editor-sidebar { position: static; }
}
</style>
