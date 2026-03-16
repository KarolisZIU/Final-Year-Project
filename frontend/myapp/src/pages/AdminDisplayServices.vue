<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { authHeaders } from "../auth.js";
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
    const res = await fetch("/api/admin/services", { headers: authHeaders() });
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
      headers: authHeaders(),
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
      headers: authHeaders(),
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
  <div>
    <h1>Services</h1>
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price (€)</th>
            <th>Duration (mins)</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="s in services" :key="s.service_id">
            <template v-if="editingId === s.service_id">
              <td><input v-model="editForm.name" /></td>
              <td><input v-model.number="editForm.price" type="number" step="0.01" min="0" /></td>
              <td><input v-model.number="editForm.duration" type="number" min="1" /></td>
              <td><input v-model="editForm.isActive" type="checkbox" /></td>
              <td>
                <button @click="saveEdit(s.service_id)">Save</button>
                <button @click="cancelEdit">Cancel</button>
              </td>
            </template>

            <template v-else>
              <td>{{ s.service_name }}</td>
              <td>€{{ s.service_price }}</td>
              <td>{{ s.service_duration }}</td>
              <td>
                <span>
                  {{ s.is_active ? 'Yes' : 'No' }}
                </span>
              </td>
              <td>
                <button @click="startEdit(s)">Edit</button>
                <button @click="deleteService(s.service_id)">Delete</button>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <button @click="goToAddService">Add Service</button>
      <button @click="goBack">Back</button>
    </div>
  </div>
</template>