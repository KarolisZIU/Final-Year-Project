<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppButton from "../components/AppButton.vue";
import FormField from "../components/FormField.vue";
import { authHeaders } from "../auth.js";
import ErrorMessage from "../components/ErrorMessage.vue";
import Sidebar from "../components/Sidebar.vue";
const router = useRouter();

const newService = ref({
  name: "",
  price: "",
  duration: ""
});
const errorMessage = ref("");

async function addService() {
  errorMessage.value = "";
  try {
  const res = await fetch("/api/admin/services", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      name: newService.value.name,
      price: parseFloat(newService.value.price),
      duration: parseInt(newService.value.duration)
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    errorMessage.value = data.error;
    return;
  }

  router.push("/admin/services");
} catch (e) {
  errorMessage.value = "Failed to add service";
}}

</script>

<template>
  <div class="flex">
  <Sidebar />
  <div class="flex-1 min-h-screen flex items-center justify-center">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-8 w-full max-w-md mx-4">
      <h1 class="text-2xl font-bold text-black mb-6">Create New Service</h1>

      <ErrorMessage :message="errorMessage" />

      <form class="flex flex-col gap-4" @submit.prevent="addService">
        <FormField id="name" label="Service Name" v-model="newService.name" />
        <FormField id="price" label="Price (€)" type="number" step="0.01" min="0" v-model="newService.price" />
        <FormField id="duration" label="Duration (minutes)" type="number" min="1" v-model="newService.duration" />

        <div class="flex gap-3 pt-2">
          <AppButton type="submit" class="flex-1">Add Service</AppButton>
        </div>
      </form>
    </div>
  </div>
</div>
</template>