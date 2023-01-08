<template>
  <div v-if="state.post">
    <div>{{ state.post.title }}: {{ state.post.body }}</div>
    <div>
      <RouterLink :to="editRoute">
        <button>Bearbeiten</button>
      </RouterLink>
      <button @click="deletePost">Löschen</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const editRoute = `/post/${route.params.id}/edit`;
const state = reactive({
  post: null,
});

onMounted(async () => {
  const id = route.params.id;
  const response = await fetch(
    `//${import.meta.env.VITE_API_URL}/api/post/${id}`
  );
  const post = await response.json();
  state.post = post;
});

async function deletePost() {
  const id = route.params.id;
  const response = await fetch(
    `//${import.meta.env.VITE_API_URL}/api/post/${id}`,
    {
      method: "DELETE",
    }
  );

  if (response.status === 200) {
    router.push("/posts");
  }
}
</script>
