<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import PageWrapper from "../components/PageWrapper.vue";
import AppButton from "../components/AppButton.vue";
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
  <PageWrapper title="Our Services" max-width="max-w-2xl">
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
        <AppButton @click="bookService(service)">Book</AppButton>
      </div>
    </div>
  </PageWrapper>
</template>