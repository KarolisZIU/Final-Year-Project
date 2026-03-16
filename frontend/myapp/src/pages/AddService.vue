<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import PageWrapper from "../components/PageWrapper.vue";
import AppButton from "../components/AppButton.vue";
import FormField from "../components/FormField.vue";
import { authHeaders } from "../auth.js";
import ErrorMessage from "../components/ErrorMessage.vue";
const router = useRouter();

const newService = ref({
  name: "",
  price: "",
  duration: ""
});
const errorMessage = ref("");

function goBack() {
  router.push("/admin/services");
}

async function addService() {
  errorMessage.value = "";
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
}
</script>

<template>
  <div>
    <div>
      <h1>Create New Service</h1>

      <ErrorMessage :message="errorMessage" />

      <form @submit.prevent="addService">
        <FormField id="name" label="Service Name" v-model="newService.name" />
        <FormField id="price" label="Price (€)" type="number" step="0.01" min="0" v-model="newService.price" />
        <FormField id="duration" label="Duration (minutes)" type="number" min="1" v-model="newService.duration" />

        <div>
          <AppButton @click="addService">Add Service</AppButton>
          <AppButton variant="secondary" @click="goBack">Back</AppButton>
        </div>
      </form>
    </div>
  </div>
</template>