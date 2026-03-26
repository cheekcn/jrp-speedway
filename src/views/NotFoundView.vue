<template>
  <main style="min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px">
    <div>
      <div class="err-num">404</div>
      <h1 style="margin-bottom:12px">Off Track</h1>
      <p style="color:var(--gray-400);margin-bottom:28px">That page doesn't exist. You may have taken the wrong line.</p>
      <RouterLink to="/" class="btn btn-primary">Back to Start/Finish</RouterLink>
    </div>
  </main>
</template>
<style scoped>
.err-num {
  font-family: var(--font-display);
  font-size: clamp(8rem, 20vw, 16rem);
  font-weight: 900;
  line-height: 1;
  color: var(--red);
  opacity: 0.15;
  margin-bottom: 8px;
}
</style>
