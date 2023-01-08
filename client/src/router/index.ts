import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/posts",
      name: "posts",
      component: () => import("../views/PostsView.vue"),
    },
    {
      path: "/posts/new",
      name: "new_post",
      component: () => import("../views/CreatePostView.vue"),
    },
    {
      path: "/post/:id/edit",
      name: "edit_post",
      component: () => import("../views/EditPostView.vue"),
    },
    {
      path: "/post/:id",
      name: "post",
      component: () => import("../views/PostView.vue"),
    }
  ],
});

export default router;
