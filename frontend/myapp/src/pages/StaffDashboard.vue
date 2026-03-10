<script setup>
import { useRouter } from "vue-router";
import { clearAuth } from "../auth.js";
import AppButton from "../components/AppButton.vue";

const router = useRouter();

function logout() {
  clearAuth();
  router.push("/login");
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-8 max-w-sm w-full mx-4 text-center">
      <h1 class="text-2xl font-bold text-slate-800 mb-2">Staff Dashboard</h1>
      <p class="text-slate-500 mb-8">You are logged in as a staff member.</p>
      <AppButton variant="secondary" @click="logout">Sign Out</AppButton>
    </div>
  </div>
</template>
