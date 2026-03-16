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
  <div>
    <h1>Our Services</h1>
    <p v-if="error">{{ error }}</p>

    <div>
      <div
        v-for="service in services"
        :key="service.service_id"
      >
        <div>
          <p>{{ service.service_name }}</p>
          <p>{{ service.service_duration }} mins &middot; €{{ service.service_price }}</p>
        </div>
        <button @click="bookService(service)">Book</button>
      </div>
    </div>
  </div>
</template>