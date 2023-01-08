<template>
  <div>
    <form @submit.prevent="submit">
      <input type="text" v-model="form.title" placeholder="Titel" />
      <textarea type="text" v-model="form.body" placeholder="Inhalt" />

      <button type="submit">Post erstellen</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const form = {
  title: "",
  body: "",
};

async function submit() {
  const response = await fetch(`//${import.meta.env.VITE_API_URL}/api/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  if (response.status === 201) {
    router.push("/posts");
  }
}
</script>
