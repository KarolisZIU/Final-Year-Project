<script setup>
import { useRouter } from "vue-router";
import PageWrapper from "../components/PageWrapper.vue";
const router = useRouter();
</script>

<template>
  <PageWrapper title="Admin Dashboard" max-width="max-w-2xl">
    <p class="text-slate-500 -mt-4 mb-8">Manage your services and staff.</p>

    <div class="grid grid-cols-2 gap-4">
      <button
        @click="router.push('/admin/services')"
        class="bg-white hover:bg-indigo-50 border border-slate-200 rounded-xl p-6 text-left shadow-sm transition"
      >
        <p class="text-xl font-semibold text-slate-800">Services</p>
        <p class="text-slate-500 text-sm mt-1">Add, edit or remove services</p>
      </button>

      <button
        @click="router.push('/admin/staff')"
        class="bg-white hover:bg-indigo-50 border border-slate-200 rounded-xl p-6 text-left shadow-sm transition"
      >
        <p class="text-xl font-semibold text-slate-800">Staff</p>
        <p class="text-slate-500 text-sm mt-1">View and manage staff members</p>
      </button>
    </div>
  </PageWrapper>
</template>