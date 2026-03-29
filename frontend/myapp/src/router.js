import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Services from "./pages/Services.vue";
import Staff from "./pages/Staff.vue";
import AdminDashboard from "./pages/AdminDashboard.vue";
import AdminDisplayServices from "./pages/AdminDisplayServices.vue";
import AdminDisplayStaff from "./pages/AdminDisplayStaff.vue";
import AddService from "./pages/AddService.vue";
import Login from "./pages/Login.vue";
import AddStaff from "./pages/AddStaff.vue";
import EditStaff from "./pages/EditStaff.vue";
import StaffDashboard from "./pages/StaffDashboard.vue";
import SlotSelection from "./pages/SlotSelection.vue";
import BookingSummary from "./pages/BookingSummary.vue";
import { isLoggedIn, getRole } from "./auth.js";
import ManageBooking from "./pages/ManageBooking.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/login", component: Login },
    { path: "/book/services", component: Services },
    { path: "/book/:serviceId/staff", component: Staff },
    { path: "/book/:serviceId/:staffId/slotselection", component: SlotSelection },
    { path: "/book/:serviceId/:staffId/summary", component: BookingSummary },
    { path: "/staff/dashboard", component: StaffDashboard, meta: { requiresAuth: true, role: "staff" } },
    { path: "/admin", component: AdminDashboard, meta: { requiresAuth: true, role: "admin" } },
    { path: "/admin/services", component: AdminDisplayServices, meta: { requiresAuth: true, role: "admin" } },
    { path: "/admin/staff", component: AdminDisplayStaff, meta: { requiresAuth: true, role: "admin" } },
    { path: "/admin/services/add", component: AddService, meta: { requiresAuth: true, role: "admin" } },
    { path: "/admin/staff/add", component: AddStaff, meta: { requiresAuth: true, role: "admin" } },
    { path: "/admin/staff/edit/:id", component: EditStaff, meta: { requiresAuth: true, role: "admin" } },
    { path: "/manage-booking", component: ManageBooking }

  ],
});

router.beforeEach((to) => {
  if (!to.meta.requiresAuth) return true;
  if (!isLoggedIn()) return "/login";
  if (to.meta.role && getRole() !== to.meta.role) return "/login";
  return true;
});

export default router;