<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav style="display: flex; gap: 16px; margin-bottom: 1rem;">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/posts">Posts</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>
