<script setup>
import { onMounted, ref} from "vue";
import { useRouter } from "vue-router";
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
    <h1>Your Staff</h1>
    
    <div v-if="errorMessage" style="color: red; margin: 10px 0; padding: 10px; border: 1px solid red; background-color: #ffe6e6;">
      {{ errorMessage }}
    </div>

    <table border="1" cellpadding="8">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Role</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="s in services" :key="s.staff_id">
          <td>{{ s.staff_id }}</td>
          <td>{{ s.staff_name }}</td>
          <td>{{ s.staff_role }}</td>
          <td><button @click="deleteService(s.staff_id)">Delete</button></td>
        </tr>
      </tbody>
    </table>
<button @click="goBack">Back</button>
</template>