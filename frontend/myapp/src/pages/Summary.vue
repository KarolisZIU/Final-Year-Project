<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppButton from "../components/AppButton.vue";

const route = useRoute();
const router = useRouter();

const serviceId = computed(() => route.params.serviceId);
const staffId = computed(() => route.params.staffId);
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-8 max-w-md w-full mx-4">
      <h1 class="text-2xl font-bold text-slate-800 mb-6">Booking Summary</h1>

      <div class="space-y-3 mb-6">
        <div class="flex justify-between">
          <span class="text-slate-500">Service ID</span>
          <span class="font-semibold text-slate-800">{{ serviceId }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Staff ID</span>
          <span class="font-semibold text-slate-800">{{ staffId }}</span>
        </div>
      </div>

      <p class="text-slate-400 text-sm">Date/time selection and confirmation coming soon.</p>

      <AppButton variant="secondary" @click="router.push('/services')" class="mt-6 w-full">
        Back to Services
      </AppButton>
    </div>
  </div>
</template>