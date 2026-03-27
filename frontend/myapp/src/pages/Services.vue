<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import PageWrapper from "../components/PageWrapper.vue";
import AppButton from "../components/AppButton.vue";
const router = useRouter();

const services = ref([]);
const error = ref("");

function bookService(service) {
    router.push(`/book/${service.service_id}/staff`);
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
    <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>

    <div class="flex flex-col gap-4">
      <div
        v-for="service in services"
        :key="service.service_id"
        class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between"
      >
        <div>
          <p class="font-semibold text-slate-800 text-lg">{{ service.service_name }}</p>
          <p class="text-slate-500 text-sm mt-1">{{ service.service_duration }} mins &middot; €{{ service.service_price }}</p>
        </div>
        <AppButton @click="bookService(service)">Book</AppButton>
      </div>
    </div>
  </PageWrapper>
</template>