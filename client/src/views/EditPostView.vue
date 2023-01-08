<template>
  <div>
    <form @submit.prevent="submit">
      <input type="text" v-model="form.title" placeholder="Titel" />
      <textarea type="text" v-model="form.body" placeholder="Inhalt" />

      <button type="submit">Post bearbeiten</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const form = reactive({
  title: "",
  body: "",
});
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
  form.title = post.title;
  form.body = post.body;
});

async function submit() {
  const response = await fetch(
    `//${import.meta.env.VITE_API_URL}/api/post/${route.params.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    }
  );

  if (response.status === 200) {
    router.push("/posts");
  }
}
</script>
