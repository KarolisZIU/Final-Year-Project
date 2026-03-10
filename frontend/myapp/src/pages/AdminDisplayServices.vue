<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import PageWrapper from "../components/PageWrapper.vue";
import AppButton from "../components/AppButton.vue";
const services = ref([]);
const router = useRouter();
const editingId = ref(null);
const editForm = ref({});

function goBack() {
  router.push("/admin");
}

function goToAddService() {
  router.push("/admin/services/add");
}

async function loadServices() {
  try {
    const res = await fetch("/api/admin/services");
    if (!res.ok) {
      throw new Error("Failed to fetch services");
    }
    services.value = await res.json();
  } catch (error) {
    console.error("Error loading services:", error);
  }
}

async function deleteService(serviceId) {
  try {
    const res = await fetch(`/api/admin/services/${serviceId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Failed to delete service");
    }
    loadServices();
  } catch (error) {
    console.error("Error deleting service:", error);
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm.value),
    });
    if (!res.ok) {
      throw new Error("Failed to update service");
    }
    editingId.value = null;
    loadServices();
  } catch (error) {
    console.error("Error updating service:", error);
  }
}

onMounted(loadServices)
</script>

<template>
  <PageWrapper title="Services" max-width="max-w-4xl">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table class="w-full text-sm text-left">
        <colgroup>
          <col class="w-[200px]" />
          <col class="w-[110px]" />
          <col class="w-[140px]" />
          <col class="w-[70px]" />
          <col class="w-[150px]" />
        </colgroup>
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="px-4 py-3 font-semibold text-slate-600">Name</th>
            <th class="px-4 py-3 font-semibold text-slate-600">Price (€)</th>
            <th class="px-4 py-3 font-semibold text-slate-600">Duration (mins)</th>
            <th class="px-4 py-3 font-semibold text-slate-600">Active</th>
            <th class="px-4 py-3 font-semibold text-slate-600">Actions</th>
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
      <AppButton variant="secondary" @click="goBack">Back</AppButton>
    </div>
  </PageWrapper>
</template>