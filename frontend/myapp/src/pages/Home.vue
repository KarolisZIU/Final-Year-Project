<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <div>
    <div>
      <h1>Welcome</h1>
      <p>Book your appointment with us!</p>
      <div>
        <v-btn @click="router.push('/services')">Book Now</v-btn>
        <v-btn @click="router.push('/admin')">Admin</v-btn>
      </div>
    </div>
  </div>
</template>