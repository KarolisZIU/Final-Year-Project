<script setup>
import { useRouter } from "vue-router";
import AppButton from "../components/AppButton.vue";
const router = useRouter();
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white text-start rounded-xl px-8 py-12 shadow-lg w-full max-w-3xl">
      <h1 class="text-7xl font-bold text-black text-center mb-4">Welcome</h1>
      <p class="text-slate-500 text-2xl mb-10 text-center">Book your appointment with us!</p>
      <div class="flex gap-6 justify-center p-10">
        <AppButton class="text-xl px-10 py-4" @click="router.push('/book/services')">Book Now</AppButton>
        <AppButton class="text-xl px-10 py-4" variant="secondary" @click="router.push('/admin')">Admin</AppButton>
        <AppButton class="text-xl px-10 py-4" variant="secondary" @click="router.push('/manage-booking')">Manage Booking</AppButton>

      </div>
    </div>
  </div>
</template>