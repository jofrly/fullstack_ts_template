<template>
  <div>
    <div v-for="post in state.posts" :key="post.title">
      {{ post.title }}: {{ post.body }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive } from 'vue'

  const state = reactive({
    posts: [],
  });

  onMounted(async () => {
    const response = await fetch(`//${import.meta.env.VITE_API_URL}/api/post`);
    const posts = await response.json()
    state.posts = [...posts];
  });
</script>