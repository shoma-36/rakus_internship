import { createRouter, createWebHistory } from "vue-router";
import Chat from "../components/Chat.vue";
import Login from "../components/Login.vue";
import Diary from "../components/Diary.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      component: Login,
    },
    {
      path: "/chat/",
      name: "chat",
      component: Chat,
      beforeEnter: (to, from, next) => {
        if (from.name === "login" || from.name === "diary") {
          next();
        } else {
          next({ name: "login" });
        }
      },
    },
    {
      path: "/diary",
      name: "diary",
      component: Diary,
      beforeEnter: (to, from, next) => {
        if (from.name === "chat") {
          next();
        } else {
          next({ name: "login" });
        }
      },
    },
  ],
});

export default router;
