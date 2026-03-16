<script setup>
import { useRouter } from "vue-router";
import { clearAuth } from "../auth.js";

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
      <button @click="logout">Sign Out</button>
    </div>
  </div>
</template>
