<script setup>
import { onMounted, ref} from "vue";
import { useRouter } from "vue-router";
const services = ref([]);
const router = useRouter();
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

onMounted(loadStaff)
</script>

<template>
    <h1>Your Staff</h1>
    

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
          <td><button @click="deleteService(s.service_id)">Delete</button></td>
        </tr>
      </tbody>
    </table>
<button @click="goBack">Back</button>
</template>