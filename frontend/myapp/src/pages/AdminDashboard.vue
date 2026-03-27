<script setup>
import { useRouter } from "vue-router";
import PageWrapper from "../components/PageWrapper.vue";
import { clearAuth } from "../auth.js";
import AppButton from "../components/AppButton.vue";
const router = useRouter();

function signOut() {
  clearAuth();
  router.push("/login");
}
</script>

<template>
  <PageWrapper title="Admin Dashboard" max-width="max-w-2xl">
    <p class="text-slate-500 -mt-4 mb-8">Manage your services and staff.</p>

    <div class="grid grid-cols-2 gap-4">
      <button
        @click="router.push('/admin/services')"
        class="bg-white hover:bg-indigo-300 border border-slate-300 rounded-xl p-6 text-left shadow-sm transition"
      >
        <p class="text-xl font-semibold text-slate-800">Services</p>
        <p class="text-slate-500 text-sm mt-1">Add, edit or remove services</p>
      </button>

      <button
        @click="router.push('/admin/staff')"
        class="bg-white hover:bg-indigo-300 border border-slate-300 rounded-xl p-6 text-left shadow-sm transition"
      >
        <p class="text-xl font-semibold text-slate-800">Staff</p>
        <p class="text-slate-500 text-sm mt-1">View and manage staff members</p>
      </button>
      
    </div>
    <div class="flex items-center justify-center mt-10">
      <AppButton variant="danger" @click="signOut">
        Sign Out
      </AppButton>
    </div>

  </PageWrapper>
</template>