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
  <div>
    <div>
      <h1>Staff Dashboard</h1>
      <p>You are logged in as a staff member.</p>
      <AppButton variant="secondary" @click="logout">Sign Out</AppButton>
    </div>
  </div>
</template>
