<template>
  <div v-if="state.post">
    {{ state.post.title }}: {{ state.post.body }}
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useRoute } from 'vue-router'

const state = reactive({
  post: null,
});

onMounted(async () => {
  const id = useRoute().params.id;
  const response = await fetch(`//${import.meta.env.VITE_API_URL}/api/post/${id}`);
  const post = await response.json();
  state.post = post;
});
</script>
