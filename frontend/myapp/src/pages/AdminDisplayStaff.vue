<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import PageWrapper from "../components/PageWrapper.vue";
import AppButton from "../components/AppButton.vue";
import { authHeaders } from "../auth.js";
import ErrorMessage from "../components/ErrorMessage.vue";

const services = ref([]);
const router = useRouter();
const errorMessage = ref("");

function goBack() {
  router.push("/admin");
}

async function loadStaff() {
  try {
    const res = await fetch("/api/admin/staff", { headers: authHeaders() });
    if (!res.ok) {
      throw new Error("Failed to fetch staff");
    }
    services.value = await res.json();
  } catch (error) {
    console.error("Error loading staff:", error);
  }
}

async function deleteService(serviceId) {
  errorMessage.value = "";
  try {
    const res = await fetch(`/api/admin/staff/${serviceId}`, {
      method: "DELETE",
      headers: authHeaders(),
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

onMounted(loadStaff);
</script>

<template>
  <PageWrapper title="Staff" max-width="max-w-3xl">
    <ErrorMessage :message="errorMessage" />

    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in services" :key="s.staff_id">
            <td>{{ s.staff_name }}</td>
            <td>{{ s.staff_role }}</td>
            <td>
              <AppButton variant="danger" @click="deleteService(s.staff_id)">DeleteTEST</AppButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <AppButton variant="secondary" @click="goBack">Back</AppButton>
    </div>
  </PageWrapper>
</template>