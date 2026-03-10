<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import PageWrapper from "../components/PageWrapper.vue";
import AppButton from "../components/AppButton.vue";
import FormField from "../components/FormField.vue";
const router = useRouter();

const newService = ref({
  name: "",
  price: "",
  duration: ""
});

function goBack() {
  router.push("/admin/services");
}

async function addService() {
  await fetch("/api/admin/services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: newService.value.name,
      price: parseFloat(newService.value.price),
      duration: parseInt(newService.value.duration)
    }),
  });
  
  router.push("/admin/services");
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-8 w-full max-w-md mx-4">
      <h1 class="text-2xl font-bold text-slate-800 mb-6">Create New Service</h1>

      <form class="flex flex-col gap-4" @submit.prevent="addService">
        <FormField id="name" label="Service Name" v-model="newService.name" />
        <FormField id="price" label="Price (€)" type="number" step="0.01" min="0" v-model="newService.price" />
        <FormField id="duration" label="Duration (minutes)" type="number" min="1" v-model="newService.duration" />

        <div class="flex gap-3 pt-2">
          <AppButton @click="addService" class="flex-1">Add Service</AppButton>
          <AppButton variant="secondary" @click="goBack" class="flex-1">Back</AppButton>
        </div>
      </form>
    </div>
  </div>
</template>