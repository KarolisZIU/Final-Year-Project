<script setup>
import { useRouter } from "vue-router";
import { clearAuth, authHeaders } from "../auth.js";
import AppButton from "../components/AppButton.vue";
import PageWrapper from "../components/PageWrapper.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import { onMounted, ref, watch } from "vue";

const router = useRouter();
const error = ref("");
const results = ref([]);
const currentDate = ref(new Date().toLocaleDateString("en-CA"));

function logout() {
  clearAuth();
  router.push("/login");
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

async function fetchBookings(date) {
  try {
    const res = await fetch(`/api/booking/staff-bookings?date=${date}`, { headers: authHeaders() });
    if (!res.ok) {
      const data = await res.json();
      error.value = data.error || "Failed to load bookings";
      return;
    }
    results.value = await res.json();
  } catch (err) {
    error.value = "Failed to load staff bookings";
  }
}

function nextDay() {
  const d = new Date(currentDate.value);
  d.setDate(d.getDate() + 1);
  currentDate.value = d.toLocaleDateString("en-CA");
}

function prevDay() {
  const d = new Date(currentDate.value);
  d.setDate(d.getDate() - 1);
  currentDate.value = d.toLocaleDateString("en-CA");
}

async function cancelBooking(bookingId) {
  try {
    const res = await fetch(`/api/booking/${bookingId}/cancel`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    if (!res.ok) {
      const data = await res.json();
      error.value = data.error || "Failed to cancel booking";
      return;
    }
    results.value = results.value.filter(b => b.booking_id !== bookingId);
  } catch (err) {
    error.value = "Failed to cancel booking";
  }
}


onMounted(() => fetchBookings(currentDate.value));
watch(currentDate, (newDate) => fetchBookings(newDate));



</script>

<template>
  <PageWrapper title="Your Upcoming Bookings" max-width="max-w-2xl">
    <ErrorMessage :message="error" />

    <div class="flex items-center justify-between mb-6">
      <AppButton variant="secondary" @click="prevDay">Previous Day</AppButton>
      <p class="font-medium text-slate-700">{{ currentDate }}</p>
      <AppButton variant="secondary" @click="nextDay">Next Day</AppButton>
    </div>

    <div
      v-if="results.length"
      v-for="result in results"
      :key="result.booking_id"
      class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-4"
    >
      <p>Customer Name: {{ result.customer_name }}</p>
      <p>Service: {{ result.service_name }}</p>
      <p>Duration: {{ result.service_duration }}</p>
      <p>Start Time: {{ formatTime(result.booking_start_time) }}</p>
      <AppButton variant="danger" class="mt-3" @click="cancelBooking(result.booking_id)">Cancel</AppButton>
    </div>
    <div v-if="!results.length" class="text-slate-500 text-center mt-6">No bookings for this day.</div>

    <div class="absolute top-4 right-4">
      <AppButton variant="danger" @click="logout">Sign Out</AppButton>
    </div>
  </PageWrapper>
</template>
