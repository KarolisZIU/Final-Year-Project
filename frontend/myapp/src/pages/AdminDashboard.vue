<script setup>
import { useRouter } from "vue-router";
import PageWrapper from "../components/PageWrapper.vue";
import { clearAuth } from "../auth.js";
const router = useRouter();

function signOut() {
  clearAuth();
  router.push("/login");
}
</script>

<template>
  <PageWrapper title="Admin Dashboard" max-width="max-w-2xl">
    <div>
      <button @click="signOut">
        Sign Out
      </button>
    </div>

    <p>Manage your services and staff.</p>

    <div>
      <button @click="router.push('/admin/services')">
        <p>Services</p>
        <p>Add, edit or remove services</p>
      </button>

      <button @click="router.push('/admin/staff')">
        <p>Staff</p>
        <p>View and manage staff members</p>
      </button>
    </div>

  </PageWrapper>
</template>