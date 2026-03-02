import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Services from "./pages/Services.vue";
import Staff from "./pages/Staff.vue";
import Summary from "./pages/Summary.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/services", component: Services },
    { path: "/staff/:serviceId", component: Staff },
    { path: "/summary/:serviceId/:staffId", component: Summary },
  ],
});

export default router;