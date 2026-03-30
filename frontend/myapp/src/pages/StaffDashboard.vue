<script setup>
import { useRouter } from "vue-router";
import { clearAuth, authHeaders } from "../auth.js";
import AppButton from "../components/AppButton.vue";
import PageWrapper from "../components/PageWrapper.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import { onMounted, ref } from "vue";

const router = useRouter();
const error = ref("");
const results = ref([]);
function logout() {
  clearAuth();
  router.push("/login");
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

onMounted(async () => {
  try {
    const res = await fetch("/api/booking/staff-bookings", { headers: authHeaders() });
    if (!res.ok) {
      throw new Error("Failed to fetch staff");
    }
    results.value = await res.json();
  }
  catch (err) {
    error.value = "Failed to load staff bookings";
  }
});

</script>

<template>
  <PageWrapper title="Your Upcoming Bookings" max-width="max-w-2xl">
    <ErrorMessage :message="error" />

    <div 
    v-for = "result in results"
    :key = "result.booking_id"
    class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-4"
    >
    <p>Customer Name: {{ result.customer_name }}</p>
    <p>Service: {{ result.service_name }}</p>
    <p>Duration: {{ result.service_duration }}</p>
    <p>Start Time: {{ formatTime(result.booking_start_time) }}</p>
    </div>
    <div v-if="!results.length" class="text-slate-500 text-center mt-6">No bookings for today.</div>

    <div class="absolute top-4 right-4">
      <AppButton variant="danger" @click="logout">
        Sign Out
      </AppButton>
    </div>
  </PageWrapper>

</template>
