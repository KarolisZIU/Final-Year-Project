<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PageWrapper from "../components/PageWrapper.vue";
import AppButton from "../components/AppButton.vue";
import ErrorMessage from '../components/ErrorMessage.vue';
import FormField from '../components/FormField.vue';

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
        const response = await fetch(`/api/booking/customer-bookings?email=${email.value}`);
        bookings.value = await response.json();
        searched.value = true;
    } catch (err) {
        error.value = "Failed to load bookings";
    }
}

async function cancelBooking(bookingId) {
    try {
        const response = await fetch(`/api/booking/${bookingId}/cancel`, {
            method: "PATCH",
        });
        if (!response.ok) {
            throw new Error("Failed to cancel booking");
        }
        // Remove the canceled booking from the list
        bookings.value = bookings.value.filter(booking => booking.booking_id !== bookingId);
    } catch (err) {
        error.value = "Failed to cancel booking";
    }
}
</script>

<template>
    <PageWrapper title="Manage Bookings" max-width="max-w-2xl">
        <ErrorMessage :message="error" />

        <div class="flex gap-3 items-end mb-6">
            <FormField id="email" label="Email" v-model="email" type="email" />
            <AppButton @click="fetchBookings">Find Bookings</AppButton>
        </div>

        <div class="flex flex-col gap-4">
            <div
                v-for="booking in bookings"
                :key="booking.booking_id"
                class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between"
            >
                <div>
                    <p class="font-semibold text-slate-800 text-lg">{{ booking.service_name }}</p>
                    <p class="text-slate-500 text-sm mt-1">With {{ booking.staff_name }} &middot; {{ new Date(booking.booking_start_time).toLocaleString() }}</p>
                </div>
                <AppButton variant="secondary" @click="cancelBooking(booking.booking_id)">Cancel</AppButton>
            </div>
        </div>

        <p v-if="bookings.length === 0 && searched" class="text-slate-500 text-center mt-6">No bookings found.</p>

        <div class="flex justify-start mt-4">
            <AppButton variant="secondary" @click="router.push('/')">Back</AppButton>
        </div>
    </PageWrapper>
</template>