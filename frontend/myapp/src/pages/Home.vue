<script setup>
import { useRouter } from "vue-router";
import AppButton from "../components/AppButton.vue";
import NavBar from "../components/NavBar.vue";
const router = useRouter();
</script>

<template>
  <NavBar />
  <div class="flex items-center justify-center pt-30">
    <div class="bg-white text-start rounded-xl px-8 py-8 shadow-lg w-full max-w-3xl">
      <h1 class="text-5xl font-bold text-black text-center mb-10 mt-10">Welcome to Kevin's Barbershop</h1>
      <p class="text-slate-500 text-2xl mb-10 text-center">Book your appointment with us!</p>
      <div class="flex gap-6 justify-center p-10">
        <AppButton size="lg" variant="primary" @click="router.push('/book/services')">Book Now</AppButton>
        <AppButton size="lg" variant="secondary" @click="router.push('/manage-booking')">Retrieve Booking</AppButton>
      </div>
    </div>
  </div>
</template>