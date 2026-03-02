<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

function goToServices() {
  router.push("/services");
}
</script>

<template>
  <div style="padding: 20px">
    <h1>Welcome</h1>
        <p>Book your appointment with us!</p>

    <button @click="goToServices">Book now!</button>
  </div>
</template>