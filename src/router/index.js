import { createRouter, createWebHistory } from "vue-router";

import useUserStore from "@/stores/user";

// dynamically import components used for the different routes
// so chunks are created and the bundle size is reduced
const Home = () => import("@/views/HomeView.vue");
const About = () => import("@/views/AboutView.vue");
const Manage = () => import("@/views/ManageView.vue");
const Song = () => import("@/views/SongView.vue");

const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
  },
  {
    name: "about",
    path: "/about",
    component: About,
  },
  {
    name: "manage",
    path: "/manage-music",
    component: Manage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/manage",
    redirect: { name: "manage" },
  },
  {
    name: "song",
    path: "/song/:id",
    component: Song,
  },
  {
    path: "/:catchAll(.*)*",
    redirect: { name: "home" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: "text-yellow-500",
});

router.beforeEach((to, from) => {
  if (to.meta.requiresAuth) {
    const store = useUserStore();
    if (!store.userLoggedIn) {
      return { name: "home" };
    }
  }
});

export default router;
