<script setup>
import { useRouter } from "vue-router";
import PageWrapper from "../components/PageWrapper.vue";
import AppButton from "../components/AppButton.vue";
const router = useRouter();
</script>

<template>
  <div>
    <div>
      <h1>Welcome</h1>
      <p>Book your appointment with us!</p>
      <div>
        <AppButton @click="router.push('/services')">Book Now</AppButton>
        <AppButton variant="secondary" @click="router.push('/admin')">Admin</AppButton>
      </div>
    </div>
  </div>
</template>