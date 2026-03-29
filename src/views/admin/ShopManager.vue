<template>
  <div>
    <div class="manager-header">
      <h2 class="manager-title">Shop / Products</h2>
      <button class="btn btn-primary" @click="openForm()">+ Add Product</button>
    </div>

    <div v-if="loading" class="spinner"></div>
    <div v-else-if="products.length === 0" class="empty-state">
      <p>No products listed yet.</p>
    </div>
    <div v-else class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-admin-card card">
        <div class="product-img">
          <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" />
          <div v-else class="product-img-placeholder">{{ product.category === 'Tires' ? '🏎' : '🔧' }}</div>
        </div>
        <div class="product-details">
          <div class="product-meta-row">
            <span class="text-mono text-muted" style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.1em">{{ product.category }}</span>
            <span v-if="product.condition" class="badge badge-outline" style="font-size:0.6rem">{{ product.condition }}</span>
          </div>
          <h3>{{ product.name }}</h3>
          <p class="product-price">${{ product.price }}</p>
          <p v-if="product.description" class="text-muted" style="font-size:0.8rem;line-height:1.5;margin-top:4px">{{ truncate(product.description, 80) }}</p>
        </div>
        <div class="product-row-actions">
          <button class="btn btn-outline" style="padding:6px 14px;font-size:0.75rem" @click="openForm(product)">Edit</button>
          <button class="btn btn-ghost text-red" style="padding:6px 14px;font-size:0.75rem" @click="confirmDelete(product)">Delete</button>
        </div>
      </div>
    </div>

    <!-- Product Form Modal -->
    <Teleport to="body">
      <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal large-modal">
          <h3>{{ editingProduct ? 'Edit Product' : 'New Product' }}</h3>
          <div class="form-grid">
            <div class="form-group" style="grid-column:1/-1">
              <label>Product Name *</label>
              <input v-model="form.name" type="text" placeholder="2024 Tony Kart Racer 401 R" required />
            </div>
            <div class="form-group">
              <label>Category</label>
              <select v-model="form.category">
                <option value="">— Select —</option>
                <option>Karts</option>
                <option>Tires</option>
                <option>Parts & Accessories</option>
              </select>
            </div>
            <div class="form-group">
              <label>Condition</label>
              <select v-model="form.condition">
                <option value="">— Select —</option>
                <option>New</option>
                <option>Used</option>
                <option>Refurbished</option>
              </select>
            </div>
            <div class="form-group">
              <label>Price ($) *</label>
              <input v-model="form.price" type="number" min="0" placeholder="0" required />
            </div>
            <div class="form-group">
              <label>Sale Price ($)</label>
              <input v-model="form.salePrice" type="number" min="0" placeholder="0 (optional)" />
            </div>
            <div class="form-group" style="grid-column:1/-1">
              <label>Description</label>
              <textarea v-model="form.description" rows="3" placeholder="Product details…"></textarea>
            </div>

            <!-- Image upload -->
            <div class="form-group" style="grid-column:1/-1">
              <label>Product Image</label>
              <div
                class="image-upload-area"
                :class="{ 'has-image': imagePreview || form.imageUrl }"
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
                <div v-if="imagePreview || form.imageUrl" class="image-preview">
                  <img :src="imagePreview || form.imageUrl" alt="Preview" />
                  <button type="button" class="image-remove-btn" @click.stop="removeImage" title="Remove image">✕</button>
                </div>
                <div v-else class="upload-prompt">
                  <span class="upload-icon">📷</span>
                  <span class="upload-text">Click or drag & drop to upload</span>
                  <span class="upload-sub">JPG, PNG, WEBP — max 5MB</span>
                </div>
              </div>
              <!-- Progress bar -->
              <div v-if="uploadProgress !== null" class="upload-progress-wrap">
                <div class="upload-progress-bar" :style="{ width: uploadProgress + '%' }"></div>
                <span class="upload-progress-label">
                  {{ uploadProgress < 100 ? `Uploading ${uploadProgress}%…` : 'Upload complete!' }}
                </span>
              </div>
            </div>

            <div class="form-group" style="grid-column:1/-1">
              <label>Specs (one per line)</label>
              <textarea v-model="specsText" rows="4" placeholder="Engine: TM KZ10C&#10;Chassis: 30mm&#10;Year: 2024"></textarea>
            </div>
          </div>

          <div v-if="formError" class="alert" style="margin-top:12px">{{ formError }}</div>
          <div class="modal-actions">
            <button class="btn btn-outline" @click="closeForm">Cancel</button>
            <button
              class="btn btn-primary"
              @click="saveProduct"
              :disabled="formLoading || uploadProgress !== null"
            >
              {{ formLoading ? 'Saving…' : (editingProduct ? 'Update' : 'Add Product') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete confirm -->
      <div v-if="deletingProduct" class="modal-overlay" @click.self="deletingProduct = null">
        <div class="modal">
          <h3>Delete Product?</h3>
          <p>Delete <strong>{{ deletingProduct.name }}</strong>? This cannot be undone.</p>
          <div class="modal-actions">
            <button class="btn btn-outline" @click="deletingProduct = null">Cancel</button>
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
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/firebase/services'
import { storage } from '@/firebase/config'
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'

const products = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingProduct = ref(null)
const deletingProduct = ref(null)
const formLoading = ref(false)
const deleteLoading = ref(false)
const formError = ref('')
const specsText = ref('')

// Image state
const fileInput = ref(null)
const selectedFile = ref(null)
const imagePreview = ref(null)
const uploadProgress = ref(null)

const blankForm = () => ({
  name: '', category: '', condition: '', price: '', salePrice: '',
  description: '', imageUrl: '', specs: []
})
const form = reactive(blankForm())

onMounted(async () => {
  try { products.value = await getProducts() } catch { /* empty */ }
  loading.value = false
})

const truncate = (text, len = 100) => text?.length > len ? text.slice(0, len) + '…' : text

// ── Form open/close ────────────────────────────────────────────────────────
const openForm = (product = null) => {
  formError.value = ''
  selectedFile.value = null
  imagePreview.value = null
  uploadProgress.value = null
  editingProduct.value = product ? { id: product.id } : null

  if (product) {
    Object.assign(form, {
      name:            product.name || '',
      category:        product.category || '',
      condition:       product.condition || '',
      price:           product.price || '',
      salePrice:       product.salePrice || '',
      description:     product.description || '',
      imageUrl:        product.imageUrl || '',
      specs:           product.specs || [],
    })
    specsText.value = (product.specs || []).join('\n')
  } else {
    Object.assign(form, blankForm())
    specsText.value = ''
  }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingProduct.value = null
  selectedFile.value = null
  imagePreview.value = null
  uploadProgress.value = null
  if (fileInput.value) fileInput.value.value = ''
}

// ── Image handling ─────────────────────────────────────────────────────────
const triggerFileInput = () => {
  if (!imagePreview.value && !form.imageUrl) fileInput.value?.click()
}

const handleFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file) setFile(file)
}

const handleDrop = (e) => {
  const file = e.dataTransfer.files?.[0]
  if (file && file.type.startsWith('image/')) setFile(file)
  else formError.value = 'Please drop an image file.'
}

const setFile = (file) => {
  formError.value = ''
  if (file.size > 5 * 1024 * 1024) {
    formError.value = 'Image must be under 5MB.'
    return
  }
  selectedFile.value = file
  imagePreview.value = URL.createObjectURL(file)
  form.imageUrl = '' // new file supersedes any existing URL
}

const removeImage = () => {
  selectedFile.value = null
  imagePreview.value = null
  form.imageUrl = ''
  if (fileInput.value) fileInput.value.value = ''
}

// Resumable upload → returns download URL
const uploadImage = (file, productId) => {
  return new Promise((resolve, reject) => {
    const ext = file.name.split('.').pop().toLowerCase()
    const path = `products/${productId}_${Date.now()}.${ext}`
    const sRef = storageRef(storage, path)
    const task = uploadBytesResumable(sRef, file)

    task.on(
      'state_changed',
      (snap) => {
        uploadProgress.value = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
      },
      (err) => {
        uploadProgress.value = null
        reject(err)
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        uploadProgress.value = null
        resolve(url)
      }
    )
  })
}

// ── Save ───────────────────────────────────────────────────────────────────
const saveProduct = async () => {
  if (!form.name || !form.price) {
    formError.value = 'Name and price are required.'
    return
  }
  formLoading.value = true
  formError.value = ''

  try {
    const specs = specsText.value.split('\n').map(s => s.trim()).filter(Boolean)
    let imageUrl = form.imageUrl

    // Upload new image if one was selected
    if (selectedFile.value) {
      const tempId = editingProduct.value?.id || `product_${Date.now()}`
      imageUrl = await uploadImage(selectedFile.value, tempId)
    }

    const data = {
      name:        form.name,
      category:    form.category,
      condition:   form.condition,
      price:       form.price,
      salePrice:   form.salePrice || null,
      description: form.description,
      imageUrl,
      specs,
    }

    if (editingProduct.value) {
      await updateProduct(editingProduct.value.id, data)
      const idx = products.value.findIndex(p => p.id === editingProduct.value.id)
      if (idx > -1) products.value[idx] = { id: editingProduct.value.id, ...data }
    } else {
      const newId = await addProduct(data)
      products.value.push({ id: newId, ...data })
    }
    closeForm()
  } catch (e) {
    formError.value = 'Save failed: ' + e.message
    uploadProgress.value = null
  }
  formLoading.value = false
}

// ── Delete ─────────────────────────────────────────────────────────────────
const confirmDelete = (product) => { deletingProduct.value = product }

const doDelete = async () => {
  deleteLoading.value = true
  try {
    const product = deletingProduct.value
    // Clean up Storage image if it was uploaded to Firebase
    if (product.imageUrl?.includes('firebasestorage.googleapis.com')) {
      try {
        const sRef = storageRef(storage, product.imageUrl)
        await deleteObject(sRef)
      } catch { /* already deleted or external URL — ignore */ }
    }
    await deleteProduct(product.id)
    products.value = products.value.filter(p => p.id !== product.id)
    deletingProduct.value = null
  } catch (e) {
    alert('Delete failed: ' + e.message)
  }
  deleteLoading.value = false
}
</script>

<style scoped>
.manager-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
.manager-title { font-size: 1.2rem; letter-spacing: 0.06em; }
.empty-state { text-align: center; padding: 64px; border: 1px dashed var(--gray-600); border-radius: var(--radius); color: var(--gray-400); }

.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
.product-admin-card { display: flex; flex-direction: column; }
.product-img { height: 160px; background: var(--gray-700); overflow: hidden; }
.product-img img { width: 100%; height: 100%; object-fit: cover; }
.product-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; background: var(--off-white); }
.product-details { padding: 16px 20px; flex: 1; }
.product-meta-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.product-details h3 { font-size: 0.9rem; letter-spacing: 0.03em; margin-bottom: 4px; }
.product-price { font-family: var(--font-display); font-size: 1.2rem; font-weight: 900; color: var(--blue); }
.product-row-actions { display: flex; gap: 8px; padding: 12px 20px; border-top: 1px solid var(--gray-700); }

/* ── Image upload ── */
.image-upload-area {
  border: 2px dashed var(--gray-600);
  border-radius: var(--radius);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  overflow: hidden;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--off-white);
}
.image-upload-area:not(.has-image):hover {
  border-color: var(--blue);
  background: var(--blue-pale);
}
.image-upload-area.has-image { cursor: default; border-style: solid; border-color: var(--gray-600); }

.upload-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 28px 24px;
  text-align: center;
  pointer-events: none;
}
.upload-icon { font-size: 2rem; }
.upload-text { font-size: 0.9rem; font-weight: 600; color: var(--black); }
.upload-sub { font-size: 0.75rem; color: var(--gray-400); }

.image-preview {
  position: relative;
  width: 100%;
  height: 200px;
}
.image-preview img { width: 100%; height: 100%; object-fit: cover; display: block; }
.image-remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  z-index: 1;
}
.image-remove-btn:hover { background: rgba(232,0,15,0.85); }

.upload-progress-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}
.upload-progress-bar {
  height: 4px;
  background: var(--blue);
  border-radius: 2px;
  transition: width 0.2s ease;
  flex: 1;
}
.upload-progress-label { font-size: 0.75rem; color: var(--gray-400); white-space: nowrap; }

/* ── Modal ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 20px; overflow-y: auto; }
.modal { background: var(--white); border: 1px solid var(--gray-700); border-radius: var(--radius); padding: 32px; max-width: 440px; width: 100%; }
.large-modal { max-width: 700px; }
.modal h3 { font-size: 1.2rem; margin-bottom: 20px; color: var(--black); }
.modal p { font-size: 0.9rem; color: var(--gray-400); margin-bottom: 24px; }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
</style>
