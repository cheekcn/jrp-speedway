<template>
  <main>
    <div v-if="loading" class="spinner" style="margin-top:120px"></div>
    <template v-else-if="post">
      <div class="post-hero">
        <div class="post-hero-bg" v-if="post.coverImage">
          <img :src="post.coverImage" :alt="post.title" />
          <div class="post-hero-overlay"></div>
        </div>
        <div class="container post-hero-content">
          <RouterLink to="/blog" class="back-link">← Back to Blog</RouterLink>
          <div class="post-meta">
            <span v-if="post.category" class="badge">{{ post.category }}</span>
            <span class="post-date text-mono text-muted">{{ formatDate(post.createdAt) }}</span>
            <span v-if="post.author" class="post-author text-mono text-muted">by {{ post.author }}</span>
          </div>
          <h1 class="post-title">{{ post.title }}</h1>
          <p v-if="post.excerpt" class="post-excerpt">{{ post.excerpt }}</p>
        </div>
      </div>

      <section class="section">
        <div class="container post-body-container">
          <div class="post-body" v-html="renderedBody"></div>
          <div class="post-sidebar">
            <div class="sidebar-card">
              <h4>Share this post</h4>
              <div class="share-btns">
                <a :href="fbShare" target="_blank" rel="noopener" class="share-btn fb">Facebook</a>
                <a :href="twShare" target="_blank" rel="noopener" class="share-btn tw">Twitter/X</a>
              </div>
            </div>
            <RouterLink to="/blog" class="sidebar-card sidebar-back">
              <span>← All Articles</span>
            </RouterLink>
            <RouterLink to="/events" class="sidebar-card sidebar-cta">
              <span class="badge" style="margin-bottom:8px">Next Steps</span>
              <strong>View Upcoming Events</strong>
              <p>See what races are coming up at JRP.</p>
            </RouterLink>
          </div>
        </div>
      </section>
    </template>
    <div v-else class="container" style="padding:120px 24px;text-align:center">
      <h2>Post Not Found</h2>
      <RouterLink to="/blog" class="btn btn-outline" style="margin-top:20px">Back to Blog</RouterLink>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getBlogPost } from '@/firebase/services'

const route = useRoute()
const post = ref(null)
const loading = ref(true)

onMounted(async () => {
  try { post.value = await getBlogPost(route.params.id) } catch { /* not found */ }
  loading.value = false
})

const formatDate = (ts) => {
  if (!ts) return ''
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Very simple markdown-lite renderer (newlines → paragraphs)
const renderedBody = computed(() => {
  if (!post.value?.body) return ''
  return post.value.body
    .split(/\n{2,}/)
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('')
})

const pageUrl = computed(() => encodeURIComponent(window.location.href))
const pageTitle = computed(() => encodeURIComponent(post.value?.title || ''))
const fbShare = computed(() => `https://www.facebook.com/sharer/sharer.php?u=${pageUrl.value}`)
const twShare = computed(() => `https://twitter.com/intent/tweet?url=${pageUrl.value}&text=${pageTitle.value}`)
</script>

<style scoped>
.post-hero {
  padding-top: var(--nav-h);
  min-height: 420px;
  display: flex;
  align-items: flex-end;
  position: relative;
  overflow: hidden;
  background: var(--off-white);
}
.post-hero-bg {
  position: absolute;
  inset: 0;
}
.post-hero-bg img { width: 100%; height: 100%; object-fit: cover; opacity: 0.3; }
.post-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--black) 0%, transparent 100%);
}
.post-hero-content {
  position: relative;
  padding-bottom: 48px;
  padding-top: 48px;
}
.back-link {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--gray-400);
  margin-bottom: 20px;
  display: block;
  transition: color 0.15s;
}
.back-link:hover { color: var(--blue); }
.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.post-date, .post-author { font-size: 0.75rem; }
.post-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.0;
  margin-bottom: 12px;
  max-width: 700px;
}
.post-excerpt {
  font-size: 1rem;
  color: var(--gray-200);
  max-width: 600px;
  line-height: 1.7;
}

.post-body-container {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 64px;
  align-items: start;
}
.post-body {
  font-size: 1rem;
  line-height: 1.85;
  color: var(--black);
}
.post-body :deep(p) { margin-bottom: 20px; }
.post-body :deep(h2) {
  font-size: 1.6rem;
  margin: 36px 0 16px;
  color: var(--black);
}
.post-body :deep(h3) {
  font-size: 1.2rem;
  margin: 28px 0 12px;
  color: var(--black);
}
.post-body :deep(strong) { color: var(--black); }
.post-body :deep(a) { color: var(--blue); text-decoration: underline; }
.post-body :deep(ul), .post-body :deep(ol) {
  padding-left: 24px;
  margin-bottom: 20px;
}
.post-body :deep(li) { margin-bottom: 6px; }

.post-sidebar {
  position: sticky;
  top: calc(var(--nav-h) + 24px);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sidebar-card {
  background: var(--white);
  border: 1px solid var(--gray-700);
  border-radius: 2px;
  padding: 20px;
}
.sidebar-card h4 {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--blue);
  margin-bottom: 12px;
}
.share-btns { display: flex; gap: 8px; }
.share-btn {
  flex: 1;
  text-align: center;
  padding: 8px;
  border-radius: 2px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  transition: var(--transition);
}
.share-btn.fb { background: #1877F2; color: white; }
.share-btn.tw { background: var(--gray-700); color: white; }
.share-btn:hover { opacity: 0.85; }

.sidebar-back {
  display: flex;
  align-items: center;
  color: var(--gray-400);
  font-family: var(--font-display);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: color 0.15s;
}
.sidebar-back:hover { color: var(--blue); }
.sidebar-cta { display: flex; flex-direction: column; }
.sidebar-cta strong {
  font-family: var(--font-display);
  font-size: 0.95rem;
  letter-spacing: 0.04em;
  margin-bottom: 6px;
}
.sidebar-cta p { font-size: 0.8rem; color: var(--gray-400); }

@media (max-width: 900px) {
  .post-body-container { grid-template-columns: 1fr; }
  .post-sidebar { position: static; }
}
</style>
