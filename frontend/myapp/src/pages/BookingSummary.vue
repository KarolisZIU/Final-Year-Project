<script setup>

import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageWrapper from "../components/PageWrapper.vue";
import AppButton from "../components/AppButton.vue";

const route = useRoute();
const router = useRouter();
const serviceId = computed(() => route.params.serviceId);
const staffId = computed(() => route.params.staffId);
const date = computed(() => route.query.date);
const time = computed(() => route.query.time);
const name = computed(() => route.query.name);
const email = computed(() => route.query.email);

async function confirmBooking() {
    try {
        const res = await fetch("/api/booking/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                serviceId: serviceId.value,
                staffId: staffId.value,
                date: date.value,
                customerName: name.value,
                customerEmail: email.value,
                slotTime: time.value
            }),
        });
        if (!res.ok) {
            throw new Error("Failed to confirm booking");
        }
        alert("Booking confirmed!");
        router.push("/");
    } catch (e) {
        alert("Failed to confirm booking");
    }
}
</script>


<template>
    <PageWrapper title="Booking Summary" max-width="max-w-2xl">
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p class="font-semibold text-slate-800 text-lg mb-4">Please confirm your booking details:</p>
            <p><span class="font-medium">Service ID:</span> {{ serviceId }}</p>
            <p><span class="font-medium">Staff ID:</span> {{ staffId }}</p>
            <p><span class="font-medium">Date:</span> {{ date }}</p>
            <p><span class="font-medium">Time:</span> {{ time }}</p>
            <p><span class="font-medium">Name:</span> {{ name }}</p>
            <p><span class="font-medium">Email:</span> {{ email }}</p>
        </div>
        <AppButton class="mt-4" @click="confirmBooking">Confirm Booking</AppButton>
    </PageWrapper>

</template>