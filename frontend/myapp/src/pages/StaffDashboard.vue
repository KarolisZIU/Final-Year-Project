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
const selectedDate = ref(new Date());
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

function nextDay() {
  const d = new Date(selectedDate.value);
  d.setDate(d.getDate() + 1);
  selectedDate.value = d;
}

function prevDay() {
  const d = new Date(selectedDate.value);
  d.setDate(d.getDate() - 1);
  selectedDate.value = d;
}

function markAsCompleted(bookingId) {
  fetch(`/api/booking/${bookingId}/complete`, {
    method: "PATCH",
    headers: authHeaders(),
  }).then(res => {
    if (res.ok) {
      results.value = results.value.filter(b => b.booking_id !== bookingId);
    } else {
      res.json().then(data => {
        error.value = data.error || "Failed to mark booking as completed";
      });
    }
  }).catch(() => {
    error.value = "Failed to mark booking as completed";
  });
}

onMounted(() => fetchBookings(currentDate.value));
watch(selectedDate, (val) => {
  if (!val) return;
  currentDate.value = val.toLocaleDateString("en-CA");
  fetchBookings(currentDate.value);
});
</script>

<template>
  <PageWrapper title="Your Upcoming Bookings" max-width="max-w-4xl">
    <ErrorMessage :message="error" />

    <div class="flex gap-10">
      <div class="shrink-0">
        <VDatePicker v-model="selectedDate" />
      </div>

      <div class="flex-1">
        <div class="flex items-center justify-between mb-4">
          <AppButton variant="secondary" @click="prevDay">Previous Day</AppButton>
          <p class="font-medium text-slate-700">{{ currentDate }}</p>
          <AppButton variant="secondary" @click="nextDay">Next Day</AppButton>
        </div>

        <div
          v-if="results.length"
          v-for="result in results"
          :key="result.booking_id"
          class="bg-white rounded-xl border text-bold border-slate-200 shadow-sm p-5 mb-4"
        >
          <p><span class="font-bold">Customer Name:</span> {{ result.customer_name }}</p>
          <p><span class="font-bold">Service:</span> {{ result.service_name }}</p>
          <p><span class="font-bold">Duration:</span> {{ result.service_duration }}</p>
          <p><span class="font-bold">Start Time:</span> {{ formatTime(result.booking_start_time) }}</p>
          <AppButton variant="danger" class="mt-3" @click="cancelBooking(result.booking_id)">Cancel</AppButton>
          <AppButton variant="success" class="mt-3 ml-2" @click="markAsCompleted(result.booking_id)">Mark as completed</AppButton>
        </div>

        <div v-if="!results.length" class="text-slate-500 text-center mt-6">No bookings for this day.</div>
      </div>
    </div>

    <div class="absolute top-4 right-4">
      <AppButton variant="danger" @click="logout">Sign Out</AppButton>
    </div>
  </PageWrapper>
</template>
