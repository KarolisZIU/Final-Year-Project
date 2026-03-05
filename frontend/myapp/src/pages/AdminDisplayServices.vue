<script setup>
import { onMounted, ref} from "vue";
import { useRouter } from "vue-router";
const services = ref([]);
const router = useRouter();
function goBack() {
  router.push("/admin");
}
async function loadServices(){
  try {
    const res = await fetch("/api/admin/services");
    if (!res.ok) {
      throw new Error("Failed to fetch services");
    }
    services.value = await res.json();
  }
  catch (error) {
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

onMounted(loadServices)
</script>

<template>
    <h1>Your Services</h1>
    

    <table border="1" cellpadding="8">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Price (€)</th>
          <th>Duration (mins)</th>
          <th>Active</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="s in services" :key="s.service_id">
          <td>{{ s.service_id }}</td>
          <td>{{ s.service_name }}</td>
          <td>{{ s.service_price }}</td>
          <td>{{ s.service_duration }}</td>
          <td>{{ s.is_active ? "Yes" : "No" }}</td>
          <td><button @click="deleteService(s.service_id)">Delete</button></td>
        </tr>
      </tbody>
    </table>
<button @click="goBack">Back</button>
</template>