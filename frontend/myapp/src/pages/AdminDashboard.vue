<script setup>
import { useRouter } from "vue-router";
import { clearAuth, authHeaders, getName } from "../auth.js";
import AppButton from "../components/AppButton.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import { computed, onMounted, ref, watch } from "vue";
import Sidebar from "../components/Sidebar.vue";
import { useBookingSocket } from "../composables/useBookingSocket.js";

const router = useRouter();
const staff_name = getName();
const error = ref("");
const results = ref([]);
const selectedDate = ref(new Date());
const currentDate = ref(new Date().toLocaleDateString("en-CA"));
const filterStaff = ref("");
const staffList = ref([]);
const filtered = computed(() => {
  if (filterStaff.value) {
    return results.value.filter((b) => b.staff_name === filterStaff.value);
  } else {
    return results.value;
  }
});

useBookingSocket((data) => {
  if (data.date === currentDate.value) {
    fetchBookings(currentDate.value);
  }
});

function signOut() {
  clearAuth();
  router.push("/login");
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
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

async function fetchBookings(date) {
  try {
    const res = await fetch(`/api/admin/all-bookings?date=${date}`, {
      headers: authHeaders(),
    });
    if (!res.ok) {
      const data = await res.json();
      error.value = data.error || "Failed to load bookings";
      return;
    }
    results.value = await res.json();
  } catch (err) {
    error.value = "Failed to load bookings";
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

async function fetchStaff() {
  const res = await fetch("/api/admin/staff", { headers: authHeaders() });
  if (res.ok) staffList.value = await res.json();
}

onMounted(() => {
  fetchBookings(currentDate.value);
  fetchStaff();
});
watch(selectedDate, (val) => {
  if (!val) return;
  currentDate.value = val.toLocaleDateString("en-CA");
  fetchBookings(currentDate.value);
});
</script>

<template>
  <div class="flex">
    <Sidebar />
    <!-- rest of page -->
    <div class="min-h-screen p-5 flex-1 bg-white">
      <h1 class="text-4xl font-bold mb-15">Welcome back, {{ staff_name }}</h1>
      <ErrorMessage :message="error" />

      <div class="flex gap-10">
        <div class="shrink-0">
          <VDatePicker v-model="selectedDate" />
        </div>

        <div class="flex-1">
          <select
            v-model="filterStaff"
            class="w-full border focus:outline-none focus:ring-1 focus:ring-slate-300 bg-white border-slate-300 rounded-lg px-3 py-2 text-sm mb-5"
          >
            <option value="">All Staff</option>
            <option
              v-for="s in staffList"
              :key="s.staff_id"
              :value="s.staff_name"
            >
              {{ s.staff_name }}
            </option>
          </select>

          <div class="flex items-center justify-between mb-4">
            <AppButton variant="secondary" @click="prevDay"
              >Previous Day</AppButton
            >
            <p class="font-medium text-slate-700">{{ currentDate }}</p>
            <AppButton variant="secondary" @click="nextDay">Next Day</AppButton>
          </div>

          <div
            v-if="results.length"
            v-for="result in filtered"
            :key="result.booking_id"
            class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-4"
          >
            <p>
              <span class="font-bold">Customer Name:</span>
              {{ result.customer_name }}
            </p>
            <p><span class="font-bold">Staff:</span> {{ result.staff_name }}</p>
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
          </div>

          <div v-if="!filtered.length" class="text-gray-500 text-center mt-6">
            No bookings for this day.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
