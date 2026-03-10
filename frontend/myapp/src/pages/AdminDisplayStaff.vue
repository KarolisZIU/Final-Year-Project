<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import PageWrapper from "../components/PageWrapper.vue";
import AppButton from "../components/AppButton.vue";
const services = ref([]);
const router = useRouter();
const errorMessage = ref("");

function goBack() {
  router.push("/admin");
}
async function loadStaff(){
  try {
    const res = await fetch("/api/admin/staff");
    if (!res.ok) {
      throw new Error("Failed to fetch staff");
    }
    services.value = await res.json();
  }
  catch (error) {
    console.error("Error loading staff:", error);
  }
}
async function deleteService(serviceId) {
  errorMessage.value = "";
  try {
    const res = await fetch(`/api/admin/staff/${serviceId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      errorMessage.value = data.error || "Failed to delete staff";
      return;
    }
    loadStaff();
  } catch (error) {
    console.error("Error deleting staff:", error);
    errorMessage.value = "Failed to delete staff member";
  }
}

onMounted(loadStaff)
</script>

<template>
  <PageWrapper title="Staff" max-width="max-w-3xl">
    <div v-if="errorMessage" class="mb-4 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
      {{ errorMessage }}
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table class="w-full text-sm text-left">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="px-4 py-3 font-semibold text-slate-600">ID</th>
            <th class="px-4 py-3 font-semibold text-slate-600">Name</th>
            <th class="px-4 py-3 font-semibold text-slate-600">Role</th>
            <th class="px-4 py-3 font-semibold text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="s in services" :key="s.staff_id" class="hover:bg-slate-50">
            <td class="px-4 py-3 text-slate-500">{{ s.staff_id }}</td>
            <td class="px-4 py-3 text-slate-800 font-medium">{{ s.staff_name }}</td>
            <td class="px-4 py-3 text-slate-600">{{ s.staff_role }}</td>
            <td class="px-4 py-3">
              <AppButton variant="danger" @click="deleteService(s.staff_id)">Delete</AppButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4">
      <AppButton variant="secondary" @click="goBack">Back</AppButton>
    </div>
  </PageWrapper>
</template>