<script setup>
import { useRouter } from "vue-router";
import AppButton from "../components/AppButton.vue";
const router = useRouter();
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white text-start px-6">
      <h1 class="text-4xl font-bold text-slate-800 mb-3">Welcome</h1>
      <p class="text-slate-500 text-lg mb-8">Book your appointment with us!</p>
      <div class="flex gap-4 justify-center">
        <AppButton @click="router.push('/book/services')">Book Now</AppButton>
        <AppButton variant="secondary" @click="router.push('/admin')">Admin</AppButton>
      </div>
    </div>
  </div>
</template>