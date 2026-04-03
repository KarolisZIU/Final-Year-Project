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

onMounted(loadServices);
</script>

<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1 min-h-screen p-5 flex flex-col">
      <div class="flex items-center justify-between mb-15">
        <h1 class="text-4xl font-bold">Your Services</h1>
        <AppButton @click="goToAddService"> Add Service </AppButton>
      </div>
      <ErrorMessage :message="error" />
      <div
        class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <table class="w-full text-sm text-left table-fixed">
          <colgroup>
            <col class="w-5" />
            <col class="w-5" />
            <col class="w-5" />
            <col class="w-5" />
            <col class="w-5" />
          </colgroup>
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-4 py-3 font-semibold text-black">Name</th>
              <th class="px-4 py-3 font-semibold text-black">Price (€)</th>
              <th class="px-4 py-3 font-semibold text-black">
                Duration (mins)
              </th>
              <th class="px-4 py-3 font-semibold text-black">Active</th>
              <th class="px-4 py-3 font-semibold text-black">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="s in services"
              :key="s.service_id"
              class="hover:bg-slate-50"
            >
              <template v-if="editingId === s.service_id">
                <td class="px-4 py-3">
                  <input
                    v-model="editForm.name"
                    class="w-full border border-slate-300 rounded px-2 py-1 text-sm"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model.number="editForm.price"
                    type="number"
                    step="0.01"
                    min="0"
                    class="w-full border border-slate-300 rounded px-2 py-1 text-sm"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model.number="editForm.duration"
                    type="number"
                    min="1"
                    class="w-full border border-slate-300 rounded px-2 py-1 text-sm"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model="editForm.isActive"
                    type="checkbox"
                    class="w-4 h-4 accent-black"
                  />
                </td>
                <td class="px-4 py-3 flex gap-2">
                  <button @click="saveEdit(s.service_id)">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6.5 rounded-md transition hover:bg-black hover:text-white"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  </button>
                  <button @click="cancelEdit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6.5 rounded-md transition hover:bg-black hover:text-white"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </td>
              </template>

              <template v-else>
                <td class="px-4 py-3 text-slate-800 font-medium">
                  {{ s.service_name }}
                </td>
                <td class="px-4 py-3 text-slate-600">€{{ s.service_price }}</td>
                <td class="px-4 py-3 text-slate-600">
                  {{ s.service_duration }}
                </td>
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
                  <button variant="secondary" @click="startEdit(s)">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6.5 rounded-md transition hover:bg-black hover:text-white"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                  <button @click="deleteService(s.service_id)">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6.5 rounded-md transition hover:bg-black hover:text-white"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex mt-15">
        <button @click="router.back()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="3"
            stroke="currentColor"
            class="size-10 cursor-pointer hover:text-white hover:bg-black rounded-full transition"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
