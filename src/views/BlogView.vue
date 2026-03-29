<template>
  <main>
    <div class="page-hero">
      <div class="container">
        <p class="page-hero-eyebrow">// BLOG</p>
        <h1>Karting<br><span class="text-blue">Knowledge</span></h1>
        <p>Setup tips, race recaps, driver spotlights, and news from the JRP paddock.</p>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div v-if="loading" class="spinner"></div>
        <div v-else-if="posts.length === 0" class="empty-state">
          <span style="font-size:2rem;display:block;margin-bottom:12px">✍️</span>
          <p>No posts yet. Check back soon!</p>
        </div>
        <div v-else>
          <!-- Featured post -->
          <RouterLink v-if="featured" :to="`/blog/${featured.id}`" class="featured-post card">
            <div class="featured-image">
              <img v-if="featured.coverImage" :src="featured.coverImage" :alt="featured.title" />
              <div v-else class="featured-placeholder">🏁</div>
            </div>
            <div class="featured-body">
              <div class="post-meta">
                <span v-if="featured.category" class="badge">{{ featured.category }}</span>
                <span class="post-date text-mono text-muted">{{ formatDate(featured.createdAt) }}</span>
              </div>
              <h2 class="featured-title">{{ featured.title }}</h2>
              <p class="featured-excerpt">{{ featured.excerpt || truncate(featured.body) }}</p>
              <span class="read-more">Read Article →</span>
            </div>
          </RouterLink>

          <!-- Post grid -->
          <div class="posts-grid" style="margin-top:40px">
            <RouterLink
              v-for="post in restPosts"
              :key="post.id"
              :to="`/blog/${post.id}`"
              class="post-card card"
            >
              <div class="post-cover">
                <img v-if="post.coverImage" :src="post.coverImage" :alt="post.title" />
                <div v-else class="post-placeholder">🏎</div>
              </div>
              <div class="post-body">
                <div class="post-meta">
                  <span v-if="post.category" class="badge badge-outline" style="font-size:0.6rem">{{ post.category }}</span>
                  <span class="post-date text-mono text-muted">{{ formatDate(post.createdAt) }}</span>
                </div>
                <h3 class="post-title">{{ post.title }}</h3>
                <p class="post-excerpt">{{ post.excerpt || truncate(post.body) }}</p>
                <span class="read-more">Read →</span>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getBlogPosts } from '@/firebase/services'

const posts = ref([])
const loading = ref(true)

onMounted(async () => {
  try { posts.value = await getBlogPosts() } catch { /* empty */ }
  loading.value = false
})

const featured = computed(() => posts.value[0] || null)
const restPosts = computed(() => posts.value.slice(1))

const formatDate = (ts) => {
  if (!ts) return ''
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
const truncate = (text, len = 140) => {
  if (!text) return ''
  return text.length > len ? text.slice(0, len) + '…' : text
}
</script>

<style scoped>
.featured-post {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  min-height: 360px;
  overflow: hidden;
}
.featured-image {
  overflow: hidden;
  background: var(--gray-700);
}
.featured-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.featured-post:hover .featured-image img { transform: scale(1.04); }
.featured-placeholder {
  width: 100%; height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  background: var(--off-white);
}
.featured-body {
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.post-date { font-size: 0.7rem; }
.featured-title {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  line-height: 1.1;
  margin-bottom: 14px;
}
.featured-excerpt {
  font-size: 0.9rem;
  color: var(--gray-200);
  line-height: 1.7;
  margin-bottom: 20px;
}
.read-more {
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--blue);
  margin-top: auto;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}
.post-card { display: flex; flex-direction: column; }
.post-cover {
  height: 180px;
  background: var(--gray-700);
  overflow: hidden;
}
.post-cover img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.post-card:hover .post-cover img { transform: scale(1.05); }
.post-placeholder {
  width: 100%; height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  background: var(--off-white);
}
.post-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.post-title { font-size: 1rem; letter-spacing: 0.03em; margin-bottom: 8px; line-height: 1.3; }
.post-excerpt { font-size: 0.82rem; color: var(--gray-400); line-height: 1.6; flex: 1; }
.post-card .read-more { margin-top: 12px; font-size: 0.75rem; }

.empty-state {
  text-align: center;
  padding: 80px 24px;
  border: 1px dashed var(--gray-700);
  border-radius: 2px;
  color: var(--gray-400);
}

@media (max-width: 768px) {
  .featured-post { grid-template-columns: 1fr; }
  .featured-image { height: 220px; }
  .featured-body { padding: 24px; }
}
</style>
