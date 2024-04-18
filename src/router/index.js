import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import TestView from "../views/TestView.vue";
import CreateAccountView from "../views/CreateAccountView.vue";
import BoredRoomView from "../views/BoredRoomView.vue";
import LoginView from "../views/LoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/test",
      name: "test",
      component: TestView,
    },
    {
      path: "/createAccount",
      name: "createAccount",
      component: CreateAccountView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/boredRoom",
      name: "boredRoom",
      component: BoredRoomView,
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem("token");
        if (token) {
          next(); // allow the navigation
        } else {
          next({ name: "home" }); // redirect to home if no token
        }
      },
    },
  ],
});

export default router;
