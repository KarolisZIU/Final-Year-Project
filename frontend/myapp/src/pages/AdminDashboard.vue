<script setup>
import { useRouter } from "vue-router";
import { clearAuth } from "../auth.js";
const router = useRouter();

function signOut() {
  clearAuth();
  router.push("/login");
}
</script>

<template>
  <div>
    <h1>Admin Dashboard</h1>
    <div>
      <button @click="signOut">Sign Out</button>
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
  </div>
</template>