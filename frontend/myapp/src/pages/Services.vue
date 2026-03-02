<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const services = ref([]);
const error = ref("");

function bookService(service) {
    router.push(`/staff/${service.service_id}`);
}
onMounted(async () => {
  try {
    const response = await fetch("/api/services");
    services.value = await response.json();
  } catch (err) {
    error.value = "Failed to load services";
  }
});
</script>

<template>
  <div style="padding: 20px">
    <h1>Services</h1>

    <p v-if="error">{{ error }}</p>

    <ul>
      <li v-for="service in services" :key="service.service_id">
        {{ service.service_name }} — €{{ service.service_price }} — {{ service.service_duration }} mins
        <button @click="bookService(service)">Book</button>
      </li>
    </ul>
  </div>
</template>