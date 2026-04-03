<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import AppButton from "../components/AppButton.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import { authHeaders } from "../auth.js";
import Sidebar from "../components/Sidebar.vue";
const services = ref([]);
const router = useRouter();
const editingId = ref(null);
const editForm = ref({});
const error = ref("");

function goToAddService() {
  router.push("/admin/services/add");
}

async function loadServices() {
  try {
    const res = await fetch("/api/admin/services", { headers: authHeaders() });
    if (!res.ok) {
      const data = await res.json();
      error.value = data.error || "Failed to load services";
      return;
    }
    services.value = await res.json();
  } catch (e) {
    error.value = "Failed to load services";
  }
}

async function deleteService(serviceId) {
  try {
    const res = await fetch(`/api/admin/services/${serviceId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) {
      const data = await res.json();
      error.value = data.error || "Failed to delete service";
      return;
    }
    loadServices();
  } catch (e) {
    error.value = "Failed to delete service";
  }
}

function startEdit(service) {
  editingId.value = service.service_id;
  editForm.value = {
    name: service.service_name,
    price: service.service_price,
    duration: service.service_duration,
    isActive: service.is_active,
  };
}

function cancelEdit() {
  editingId.value = null;
}

async function saveEdit(serviceId) {
  try {
    const res = await fetch(`/api/admin/services/${serviceId}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(editForm.value),
    });
    if (!res.ok) {
      const data = await res.json();
      error.value = data.error || "Failed to update service";
      return;
    }
    editingId.value = null;
    loadServices();
  } catch (e) {
    error.value = "Failed to update service";
  }
}

onMounted(loadServices)
</script>

<template>
  <div class="flex">
  <Sidebar />
  <div class="flex-1 min-h-screen p-5 flex flex-col">
    <h1 class="text-4xl font-bold mb-15"> Your Services</h1>
    <ErrorMessage :message="error" />
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table class="w-full text-sm text-left">
        <colgroup>
          <col class="w-[100px]" />
          <col class="w-[100px]" />
          <col class="w-[100px]" />
          <col class="w-[100px]" />
          <col class="w-[100px]" />
        </colgroup>
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="px-4 py-3 font-semibold text-black">Name</th>
            <th class="px-4 py-3 font-semibold text-black">Price (€)</th>
            <th class="px-4 py-3 font-semibold text-black">Duration (mins)</th>
            <th class="px-4 py-3 font-semibold text-black">Active</th>
            <th class="px-4 py-3 font-semibold text-black">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100">
          <tr v-for="s in services" :key="s.service_id" class="hover:bg-slate-50">
            <template v-if="editingId === s.service_id">
              <td class="px-4 py-2"><input v-model="editForm.name" class="w-full border border-slate-300 rounded px-2 py-1 text-sm" /></td>
              <td class="px-4 py-2"><input v-model.number="editForm.price" type="number" step="0.01" min="0" class="w-full border border-slate-300 rounded px-2 py-1 text-sm" /></td>
              <td class="px-4 py-2"><input v-model.number="editForm.duration" type="number" min="1" class="w-full border border-slate-300 rounded px-2 py-1 text-sm" /></td>
              <td class="px-4 py-2"><input v-model="editForm.isActive" type="checkbox" class="w-4 h-4" /></td>
              <td class="px-4 py-2 flex gap-2">
                <AppButton @click="saveEdit(s.service_id)">Save</AppButton>
                <AppButton variant="secondary" @click="cancelEdit">Cancel</AppButton>
              </td>
            </template>

            <template v-else>
              <td class="px-4 py-3 text-slate-800 font-medium">{{ s.service_name }}</td>
              <td class="px-4 py-3 text-slate-600">€{{ s.service_price }}</td>
              <td class="px-4 py-3 text-slate-600">{{ s.service_duration }}</td>
              <td class="px-4 py-3">
                <span :class="s.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'" class="text-xs font-semibold px-2 py-1 rounded-full">
                  {{ s.is_active ? 'Yes' : 'No' }}
                </span>
              </td>
              <td class="px-4 py-3 flex gap-2">
                <AppButton variant="secondary" @click="startEdit(s)">Edit</AppButton>
                <AppButton variant="danger" @click="deleteService(s.service_id)">Delete</AppButton>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex gap-3 mt-4">
      <AppButton @click="goToAddService">Add Service</AppButton>
      <AppButton variant="secondary" @click="router.back()">Back</AppButton>
    </div>
  </div>
  </div>
</template>