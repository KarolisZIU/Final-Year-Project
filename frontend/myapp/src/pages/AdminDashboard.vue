<script setup>
import { useRouter } from "vue-router";
import PageWrapper from "../components/PageWrapper.vue";
import { clearAuth, authHeaders, getName } from "../auth.js";
import AppButton from "../components/AppButton.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import { computed, onMounted, ref, watch } from "vue";

const router = useRouter();
const staff_name = getName();
const error = ref("");
const results = ref([]);
const selectedDate = ref(new Date());
const currentDate = ref(new Date().toLocaleDateString("en-CA"));
const filterStaff = ref("");
const filtered = computed(() =>
  results.value.filter(b =>
    b.staff_name.toLowerCase().includes(filterStaff.value.toLowerCase())
  )
);

function signOut() {
  clearAuth();
  router.push("/login");
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
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

async function fetchBookings(date) {
  try {
    const res = await fetch(`/api/admin/all-bookings?date=${date}`, { headers: authHeaders() });
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

onMounted(() => fetchBookings(currentDate.value));
watch(selectedDate, (val) => {
  if (!val) return;
  currentDate.value = val.toLocaleDateString("en-CA");
  fetchBookings(currentDate.value);
});
</script>

<template>
<div class="flex">
  <div class="min-h-screen flex flex-col w-64  bg-black">
          <div class="flex items-center gap-4 justify-center px-4 py-5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="size-6">
          <path fill-rule="evenodd" d="M8.128 9.155a3.751 3.751 0 1 1 .713-1.321l1.136.656a.75.75 0 0 1 .222 1.104l-.006.007a.75.75 0 0 1-1.032.157 1.421 1.421 0 0 0-.113-.072l-.92-.531Zm-4.827-3.53a2.25 2.25 0 0 1 3.994 2.063.756.756 0 0 0-.122.23 2.25 2.25 0 0 1-3.872-2.293ZM13.348 8.272a5.073 5.073 0 0 0-3.428 3.57 5.08 5.08 0 0 0-.165 1.202 1.415 1.415 0 0 1-.707 1.201l-.96.554a3.751 3.751 0 1 0 .734 1.309l13.729-7.926a.75.75 0 0 0-.181-1.374l-.803-.215a5.25 5.25 0 0 0-2.894.05l-5.325 1.629Zm-9.223 7.03a2.25 2.25 0 1 0 2.25 3.897 2.25 2.25 0 0 0-2.25-3.897ZM12 12.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
          <path d="M16.372 12.615a.75.75 0 0 1 .75 0l5.43 3.135a.75.75 0 0 1-.182 1.374l-.802.215a5.25 5.25 0 0 1-2.894-.051l-5.147-1.574a.75.75 0 0 1-.156-1.367l3-1.732Z" />
        </svg>
        <span class="text-xl font-bold text-white">Klink's Barbers</span>
      </div>
    <router-link to="/" class="flex items-center justify-center gap-2 py-4 text-white hover:bg-white transition hover:text-black">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
</svg>Home</router-link>
    <router-link to="/admin/services" class="flex items-center justify-center gap-2 py-4 text-white hover:bg-white transition hover:text-black">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
</svg>Services</router-link>


    <router-link to="/admin/staff" class="flex items-center justify-center gap-2 py-4 text-white hover:bg-white transition hover:text-black">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
</svg>Staff</router-link>



<button @click="signOut" class="mt-auto flex items-center justify-center gap-2 py-4 text-white hover:bg-red-400 transition cursor-pointer">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
  </svg>
  Sign Out
</button>
  </div>
  <!-- rest of page -->
  <div class="min-h-screen p-5 flex-1 bg-white">
    <h1 class="text-4xl font-bold mb-15">Welcome back, {{ staff_name }}</h1>
    <ErrorMessage :message="error" />

    <div class="flex gap-10">
      <div class="shrink-0">
        <VDatePicker v-model="selectedDate" />
      </div>

      <div class="flex-1">
        <input
          v-model="filterStaff"
          type="text"
          placeholder="Filter by staff name..."
          class="w-full border focus:outline-none focus:ring-1 focus:ring-slate-300 bg-white border-slate-300 placeholder:text-black rounded-lg px-3 py-2 text-sm mb-5"
        />

        <div class="flex items-center justify-between mb-4">
          <AppButton variant="secondary" @click="prevDay">Previous Day</AppButton>
          <p class="font-medium text-slate-700">{{ currentDate }}</p>
          <AppButton variant="secondary" @click="nextDay">Next Day</AppButton>
        </div>

        <div
          v-if="results.length"
          v-for="result in filtered"
          :key="result.booking_id"
          class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-4"
        >
          <p><span class="font-bold">Customer Name:</span> {{ result.customer_name }}</p>
          <p><span class="font-bold">Staff:</span> {{ result.staff_name }}</p>
          <p><span class="font-bold">Service:</span> {{ result.service_name }}</p>
          <p><span class="font-bold">Duration:</span> {{ result.service_duration }}</p>
          <p><span class="font-bold">Start Time:</span> {{ formatTime(result.booking_start_time) }}</p>
          <AppButton variant="secondary" class="mt-3" @click="cancelBooking(result.booking_id)">Cancel</AppButton>
          <AppButton variant="primary" class="mt-3 ml-2" @click="markAsCompleted(result.booking_id)">Mark as completed</AppButton>
        </div>

        <div v-if="!filtered.length" class="text-black text-center mt-6">No bookings for this day.</div>
      </div>
    </div>
  </div>
</div>
</template>
