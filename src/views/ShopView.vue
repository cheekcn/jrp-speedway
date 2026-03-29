<template>
  <main>
    <div class="page-hero">
      <div class="container">
        <p class="page-hero-eyebrow">// SHOP</p>
        <h1>Karts & Tires<br><span class="text-blue">For Sale</span></h1>
        <p>Competition karts and fresh rubber available at JRP Speedway. All listings updated directly from our inventory.</p>
      </div>
    </div>

    <section class="section">
      <div class="container">

        <!-- Category tabs -->
        <div class="filter-tabs">
          <button
            v-for="cat in categories"
            :key="cat"
            class="filter-tab"
            :class="{ active: activeCategory === cat }"
            @click="activeCategory = cat"
          >{{ cat }}</button>
        </div>

        <div v-if="loading" class="spinner"></div>

        <div v-else-if="filteredProducts.length === 0" class="empty-state">
          <span style="font-size:2rem;display:block;margin-bottom:12px">🛒</span>
          <p>No products listed in this category right now. Check back soon or contact us.</p>
        </div>

        <div v-else class="products-grid">
          <div v-for="product in filteredProducts" :key="product.id" class="product-card card">
            <div class="product-image">
              <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" />
              <div v-else class="product-placeholder">
                <span>{{ product.category === 'Tires' ? '🏎' : '🔧' }}</span>
              </div>
              <span v-if="product.condition" class="product-condition badge" :class="conditionClass(product.condition)">
                {{ product.condition }}
              </span>
            </div>
            <div class="product-body">
              <span class="product-cat text-mono text-muted" style="font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase">
                {{ product.category }}
              </span>
              <h3 class="product-name">{{ product.name }}</h3>
              <p v-if="product.description" class="product-desc">{{ product.description }}</p>
              <div v-if="product.specs && product.specs.length" class="product-specs">
                <div v-for="spec in product.specs" :key="spec" class="pspec">{{ spec }}</div>
              </div>
              <div class="product-footer">
                <div class="product-price">
                  <span v-if="product.salePrice" class="original-price">${{ product.price }}</span>
                  <span class="current-price">${{ product.salePrice || product.price }}</span>
                </div>
                <a :href="`mailto:info@jrpspeedway.com?subject=Inquiry: ${encodeURIComponent(product.name)}`"
                   class="btn btn-primary">
                  Inquire
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Info banner -->
    <section class="section" style="background:var(--off-white);border-top:1px solid var(--gray-700)">
      <div class="container">
        <div class="info-grid">
          <div v-for="info in infos" :key="info.title" class="info-item">
            <span class="info-icon">{{ info.icon }}</span>
            <h4>{{ info.title }}</h4>
            <p>{{ info.body }}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getProducts } from '@/firebase/services'

const products = ref([])
const loading = ref(true)
const activeCategory = ref('All')
const categories = ['All', 'Karts', 'Tires', 'Parts & Accessories']

onMounted(async () => {
  try {
    products.value = await getProducts()
  } catch { /* empty */ }
  loading.value = false
})

const filteredProducts = computed(() => {
  if (activeCategory.value === 'All') return products.value
  return products.value.filter(p => p.category === activeCategory.value)
})

const conditionClass = (c) => {
  if (c === 'New') return 'badge-yellow'
  if (c === 'Used') return 'badge-outline'
  return ''
}

const infos = [
  { icon: '🔧', title: 'Prep & Setup', body: 'We can prep purchased karts to race-ready spec in our onsite workshop.' },
  { icon: '🚚', title: 'Local Pickup', body: 'All items are pickup only at JRP Speedway, Tulsa OK. Contact us to arrange.' },
  { icon: '💬', title: 'Questions?', body: 'Reach out to info@jrpspeedway.com or call (918) 555-0100 for pricing and availability.' },
  { icon: '🔄', title: 'Trade-Ins', body: 'Ask about trade-in value on your current kart toward a new purchase.' },
]
</script>

<style scoped>
.filter-tabs {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 36px;
  border-bottom: 1px solid var(--gray-700);
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

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
.product-card { display: flex; flex-direction: column; }
.product-image {
  height: 200px;
  background: var(--gray-700);
  position: relative;
  overflow: hidden;
}
.product-image img { width: 100%; height: 100%; object-fit: cover; }
.product-placeholder {
  width: 100%; height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  background: var(--off-white);
}
.product-condition {
  position: absolute;
  top: 12px;
  right: 12px;
}
.product-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.product-name { font-size: 1rem; letter-spacing: 0.03em; margin: 4px 0 8px; }
.product-desc { font-size: 0.82rem; color: var(--gray-400); line-height: 1.6; margin-bottom: 12px; }
.product-specs {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}
.pspec {
  font-size: 0.75rem;
  color: var(--gray-400);
  font-family: var(--font-mono);
  padding: 4px 0;
  border-bottom: 1px solid var(--gray-800);
}
.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--gray-700);
}
.current-price {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--blue);
}
.original-price {
  font-size: 0.85rem;
  color: var(--gray-400);
  text-decoration: line-through;
  margin-right: 6px;
}

.empty-state {
  text-align: center;
  padding: 64px 24px;
  border: 1px dashed var(--gray-700);
  border-radius: 2px;
  color: var(--gray-400);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}
.info-item {
  padding: 24px;
  border: 1px solid var(--gray-700);
  border-radius: 2px;
}
.info-icon { font-size: 1.5rem; display: block; margin-bottom: 10px; }
.info-item h4 {
  font-family: var(--font-display);
  font-size: 0.9rem;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
}
.info-item p { font-size: 0.82rem; color: var(--gray-400); line-height: 1.6; }
</style>
