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
            <div class="form-group" style="grid-column:1/-1">
              <label>Image URL</label>
              <input v-model="form.imageUrl" type="url" placeholder="https://…" />
            </div>
            <div class="form-group" style="grid-column:1/-1">
              <label>Specs (one per line)</label>
              <textarea v-model="specsText" rows="4" placeholder="Engine: TM KZ10C&#10;Chassis: 30mm&#10;Year: 2024"></textarea>
            </div>
          </div>
          <div v-if="formError" class="alert" style="margin-top:12px">{{ formError }}</div>
          <div class="modal-actions">
            <button class="btn btn-outline" @click="closeForm">Cancel</button>
            <button class="btn btn-primary" @click="saveProduct" :disabled="formLoading">
              {{ formLoading ? 'Saving…' : (editingProduct ? 'Update' : 'Add Product') }}
            </button>
          </div>
        </div>
      </div>

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
import { ref, reactive, computed, onMounted } from 'vue'
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/firebase/services'

const products = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingProduct = ref(null)
const deletingProduct = ref(null)
const formLoading = ref(false)
const deleteLoading = ref(false)
const formError = ref('')
const specsText = ref('')

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

const openForm = (product = null) => {
  formError.value = ''
  editingProduct.value = product
  if (product) {
    Object.assign(form, product)
    specsText.value = (product.specs || []).join('\n')
  } else {
    Object.assign(form, blankForm())
    specsText.value = ''
  }
  showForm.value = true
}
const closeForm = () => { showForm.value = false; editingProduct.value = null }

const saveProduct = async () => {
  if (!form.name || !form.price) { formError.value = 'Name and price are required.'; return }
  formLoading.value = true
  formError.value = ''
  try {
    const specs = specsText.value.split('\n').map(s => s.trim()).filter(Boolean)
    const data = { ...form, specs, salePrice: form.salePrice || null }
    if (editingProduct.value) {
      await updateProduct(editingProduct.value.id, data)
      const idx = products.value.findIndex(p => p.id === editingProduct.value.id)
      if (idx > -1) products.value[idx] = { ...products.value[idx], ...data }
    } else {
      const newId = await addProduct(data)
      products.value.push({ id: newId, ...data })
    }
    closeForm()
  } catch (e) {
    formError.value = 'Save failed: ' + e.message
  }
  formLoading.value = false
}

const confirmDelete = (product) => { deletingProduct.value = product }
const doDelete = async () => {
  deleteLoading.value = true
  try {
    await deleteProduct(deletingProduct.value.id)
    products.value = products.value.filter(p => p.id !== deletingProduct.value.id)
    deletingProduct.value = null
  } catch (e) { alert('Delete failed: ' + e.message) }
  deleteLoading.value = false
}
</script>

<style scoped>
.manager-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
.manager-title { font-size: 1.2rem; letter-spacing: 0.06em; }
.empty-state { text-align: center; padding: 64px; border: 1px dashed var(--gray-700); border-radius: 2px; color: var(--gray-400); }

.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
.product-admin-card { display: flex; flex-direction: column; }
.product-img { height: 160px; background: var(--gray-700); overflow: hidden; }
.product-img img { width: 100%; height: 100%; object-fit: cover; }
.product-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; background: var(--gray-900); }
.product-details { padding: 16px 20px; flex: 1; }
.product-meta-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.product-details h3 { font-size: 0.9rem; letter-spacing: 0.03em; margin-bottom: 4px; }
.product-price { font-family: var(--font-display); font-size: 1.2rem; font-weight: 900; color: var(--red); }
.product-row-actions { display: flex; gap: 8px; padding: 12px 20px; border-top: 1px solid var(--gray-700); }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 20px; overflow-y: auto; }
.modal { background: var(--gray-900); border: 1px solid var(--gray-600); border-radius: 2px; padding: 32px; max-width: 420px; width: 100%; }
.large-modal { max-width: 680px; }
.modal h3 { font-size: 1.2rem; margin-bottom: 20px; }
.modal p { font-size: 0.9rem; color: var(--gray-200); margin-bottom: 24px; }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
</style>
