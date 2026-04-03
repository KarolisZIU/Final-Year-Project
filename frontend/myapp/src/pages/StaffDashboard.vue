<script setup>
import { authHeaders, getName } from "../auth.js";
import AppButton from "../components/AppButton.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import Sidebar from "../components/Sidebar.vue";
import { useBookingSocket } from "../composables/useBookingSocket.js";
import { onMounted, ref, watch } from "vue";

const staff_name = getName();
const error = ref("");
const results = ref([]);
const selectedDate = ref(new Date());
const currentDate = ref(new Date().toLocaleDateString("en-CA"));

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

useBookingSocket((data) => {
  if (data.date === currentDate.value) {
    fetchBookings(currentDate.value);
  }
});

async function fetchBookings(date) {
  try {
    const res = await fetch(`/api/booking/staff-bookings?date=${date}`, {
      headers: authHeaders(),
    });
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
    results.value = results.value.filter((b) => b.booking_id !== bookingId);
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
  })
    .then((res) => {
      if (res.ok) {
        results.value = results.value.filter((b) => b.booking_id !== bookingId);
      } else {
        res.json().then((data) => {
          error.value = data.error || "Failed to mark booking as completed";
        });
      }
    })
    .catch(() => {
      error.value = "Failed to mark booking as completed";
    });
}

useBookingSocket(() => {
  fetchBookings(currentDate.value);
});

onMounted(() => fetchBookings(currentDate.value));
watch(selectedDate, (val) => {
  if (!val) return;
  currentDate.value = val.toLocaleDateString("en-CA");
  fetchBookings(currentDate.value);
});
</script>

<template>
  <div class="flex">
    <Sidebar role="staff" />
    <div class="min-h-screen p-5 flex-1 bg-white">
      <h1 class="text-4xl font-bold mb-15">Welcome back, {{ staff_name }}</h1>
      <ErrorMessage :message="error" />

      <div class="flex gap-10">
        <div class="shrink-0">
          <VDatePicker v-model="selectedDate" />
        </div>

        <div class="flex-1">
          <div class="flex items-center justify-between mb-4">
            <AppButton variant="secondary" @click="prevDay"
              >Previous Day</AppButton
            >
            <p class="font-medium text-slate-700">{{ currentDate }}</p>
            <AppButton variant="secondary" @click="nextDay">Next Day</AppButton>
          </div>

          <div
            v-if="results.length"
            v-for="result in results"
            :key="result.booking_id"
            :class="result.status === 'completed' ? 'opacity-50' : ''"
            class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-4"
          >
            <p>
              <span class="font-bold">Customer Name:</span>
              {{ result.customer_name }}
            </p>
            <p>
              <span class="font-bold">Service:</span> {{ result.service_name }}
            </p>
            <p>
              <span class="font-bold">Duration:</span>
              {{ result.service_duration }}
            </p>
            <p>
              <span class="font-bold">Start Time:</span>
              {{ formatTime(result.booking_start_time) }}
            </p>
            <span
              v-if="result.status === 'completed'"
              class="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-xl"
              >Completed</span
            >
            <template v-else>
              <AppButton
                variant="secondary"
                class="mt-3"
                @click="cancelBooking(result.booking_id)"
                >Cancel</AppButton
              >
              <AppButton
                variant="primary"
                class="mt-3 ml-2"
                @click="markAsCompleted(result.booking_id)"
                >Mark as completed</AppButton
              >
            </template>
          </div>

          <div v-if="!results.length" class="text-slate-500 text-center mt-6">
            No bookings for this day.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
