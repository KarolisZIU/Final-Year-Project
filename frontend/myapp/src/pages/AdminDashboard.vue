<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>

<h1>Admin Dashboard</h1>
<p>This is admin dashboard page</p>
<button @click="router.push('/admin/services')">Your Services</button>
<button @click="router.push('/admin/staff')">Your Staff</button>
</template>