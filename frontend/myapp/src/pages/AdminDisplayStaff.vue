<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import PageWrapper from "../components/PageWrapper.vue";
import AppButton from "../components/AppButton.vue";
import { authHeaders } from "../auth.js";
import ErrorMessage from "../components/ErrorMessage.vue";
import SideBar from "../components/Sidebar.vue";
const staff = ref([]);
const router = useRouter();
const errorMessage = ref("");

function goAddStaff() {
  router.push("/admin/staff/add");
}
async function loadStaff() {
  try {
    const res = await fetch("/api/admin/staff", { headers: authHeaders() });
    if (!res.ok) {
      const data = await res.json();
      errorMessage.value = data.error || "Failed to load staff";
      return;
    }
    staff.value = await res.json();
  } catch (e) {
    errorMessage.value = "Failed to load staff";
  }
}
async function deleteStaff(staffId) {
  errorMessage.value = "";
  try {
    const res = await fetch(`/api/admin/staff/${staffId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) {
      const data = await res.json();
      errorMessage.value = data.error || "Failed to delete staff";
      return;
    }
    loadStaff();
  } catch (e) {
    errorMessage.value = "Failed to delete staff member";
  }
}

onMounted(loadStaff);
</script>

<template>
  <div class="flex">
    <SideBar />
    <div class="flex-1 min-h-screen p-5 flex flex-col">
      <h1 class="text-4xl font-bold mb-15">Manage Staff</h1>
      <ErrorMessage :message="errorMessage" />

      <div
        class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <table class="w-full text-sm text-left">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-4 py-3 font-semibold text-black">Name</th>
              <th class="px-4 py-3 font-semibold text-black">Role</th>
              <th class="px-4 py-3 font-semibold text-black">Active</th>
              <th class="px-4 py-3 font-semibold text-black">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="s in staff" :key="s.staff_id" class="hover:bg-slate-50">
              <td class="px-4 py-3 text-slate-800 font-medium">
                {{ s.staff_name }}
              </td>
              <td class="px-4 py-3 text-slate-600">{{ s.staff_role }}</td>
              <td class="px-4 py-3">
                <span
                  :class="
                    s.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-500'
                  "
                  class="text-xs font-semibold px-2 py-1 rounded-full"
                >
                  {{ s.is_active ? "Yes" : "No" }}
                </span>
              </td>
              <td class="px-4 py-3 flex gap-2">
                <AppButton
                  variant="secondary"
                  @click="router.push(`/admin/staff/edit/${s.staff_id}`)"
                  >Edit</AppButton
                >
                <AppButton variant="danger" @click="deleteStaff(s.staff_id)"
                  >Delete</AppButton
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex gap-3 mt-4">
        <AppButton variant="primary" @click="goAddStaff"
          >Add new staff</AppButton
        >
        <AppButton variant="secondary" @click="router.back()">Back</AppButton>
      </div>
    </div>
  </div>
</template>
