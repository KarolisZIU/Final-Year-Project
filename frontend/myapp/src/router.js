import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Services from "./pages/Services.vue";
import Staff from "./pages/Staff.vue";
import Summary from "./pages/Summary.vue";
import AdminDashboard from "./pages/AdminDashboard.vue";
import AdminDisplayServices from "./pages/AdminDisplayServices.vue";
import AdminDisplayStaff from "./pages/AdminDisplayStaff.vue";
import AddService from "./pages/AddService.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/services", component: Services },
    { path: "/staff/:serviceId", component: Staff },
    { path: "/summary/:serviceId/:staffId", component: Summary },
    { path: "/admin", component: AdminDashboard },
    { path: "/admin/services", component: AdminDisplayServices },
    { path: "/admin/staff", component: AdminDisplayStaff },
    { path: "/admin/services/add", component: AddService }
  ],
});

export default router;