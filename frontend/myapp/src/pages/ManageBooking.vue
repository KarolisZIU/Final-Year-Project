<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import PageWrapper from "../components/PageWrapper.vue";
import AppButton from "../components/AppButton.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import FormField from "../components/FormField.vue";
import NavBar from "../components/NavBar.vue";

const router = useRouter();
const bookings = ref([]);
const error = ref("");
const email = ref("");
const searched = ref(false);

async function fetchBookings() {
  if (!email.value) {
    error.value = "Please enter email used for booking";
    return;
  }
  try {
    const res = await fetch(
      `/api/booking/customer-bookings?email=${email.value}`,
    );
    if (!res.ok) {
      const data = await res.json();
      error.value = data.error || "Failed to load bookings";
      return;
    }
    bookings.value = await res.json();
    searched.value = true;
  } catch (err) {
    error.value = "Failed to load bookings";
  }
}

async function cancelBooking(bookingId) {
  try {
    const res = await fetch(`/api/booking/${bookingId}/cancel`, {
      method: "PATCH",
    });
    if (!res.ok) {
      const data = await res.json();
      error.value = data.error || "Failed to cancel booking";
      return;
    }
    // Remove the canceled booking from the list
    bookings.value = bookings.value.filter(
      (booking) => booking.booking_id !== bookingId,
    );
  } catch (err) {
    error.value = "Failed to cancel booking";
  }
}
</script>

<template>
  <NavBar />
  <PageWrapper title="Retrieve Your Bookings">
    <ErrorMessage :message="error" />

    <div class="flex gap-2 items-end justify-center mb-6">
      <FormField
        id="email"
        v-model="email"
        placeholder="Enter Email"
        type="email"
      />
      <AppButton variant="primary" size="base" @click="fetchBookings"
        >Find Booking</AppButton
      >
    </div>

    <div class="flex flex-col gap-4">
      <div
        v-for="booking in bookings"
        :key="booking.booking_id"
        class="bg-white rounded-xl border border-slate-200 shadow-sm p-2 flex items-start justify-between"
      >
        <div>
          <p class="font-semibold text-slate-800 text-lg">
            {{ booking.service_name }}
          </p>
          <p class="text-slate-500 text-sm mt-1">
            With {{ booking.staff_name }} &middot;
            {{
              new Date(booking.booking_start_time).toLocaleString("en-CA", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            }}
          </p>
        </div>
        <div class="flex gap-2">
          <AppButton variant="secondary">Modify</AppButton>
          <AppButton variant="danger" @click="cancelBooking(booking.booking_id)"
            >Cancel</AppButton
          >
        </div>
      </div>
    </div>

    <p
      v-if="bookings.length === 0 && searched"
      class="text-slate-500 text-center mt-6"
    >
      No bookings found.
    </p>
  </PageWrapper>
</template>
