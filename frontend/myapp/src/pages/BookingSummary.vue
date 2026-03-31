<script setup>

import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageWrapper from "../components/PageWrapper.vue";
import AppButton from "../components/AppButton.vue";
import ErrorMessage from "../components/ErrorMessage.vue";

const route = useRoute();
const router = useRouter();
const serviceId = computed(() => route.params.serviceId);
const staffId = computed(() => route.params.staffId);
const date = computed(() => route.query.date);
const time = computed(() => route.query.time);
const name = computed(() => route.query.name);
const email = computed(() => route.query.email);

const staff = ref(null)
const service = ref(null)
const confirmed = ref(false)
const error = ref("")

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

onMounted(async () => {
    try {
        const [staffRes, serviceRes] = await Promise.all([
            fetch("/api/staff"),
            fetch("/api/services")
        ]);
        if (!staffRes.ok || !serviceRes.ok) {
            throw new Error("Failed to load staff or service details");
        }
        const staffList = await staffRes.json();
        const serviceList = await serviceRes.json();
        staff.value = staffList.find(s => s.staff_id == staffId.value);
        service.value = serviceList.find(s => s.service_id == serviceId.value);
    } catch (e) {
        error.value = "Failed to load booking details";
    }
})

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
            const data = await res.json();
            error.value = data.error || "Failed to confirm booking";
            return;
        }
        confirmed.value = true;
    } catch (e) {
        error.value = "Failed to confirm booking. Please try again.";
    }
}
</script>


<template>
    <PageWrapper title="Booking Summary" max-width="max-w-2xl">
        <div v-if="confirmed" class="bg-green-50 border border-green-200 rounded-xl p-5 mb-4">
            <p class="text-green-700 font-semibold text-lg">Booking Confirmed!</p>
            <p class="text-green-600 text-sm mt-1">Your appointment has been successfully booked.</p>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p class="font-semibold text-slate-800 text-lg mb-4">
                {{ confirmed ? 'Booking Details' : 'Please confirm your booking details:' }}
            </p>
            <p v-if="service"><span class="font-medium">Service:</span> {{ service.service_name }}</p>
            <p v-if="service"><span class="font-medium">Price:</span> €{{ service.service_price }}</p>
            <p v-if="service"><span class="font-medium">Duration:</span> {{ service.service_duration }} mins</p>
            <p v-if="staff"><span class="font-medium">Staff:</span> {{ staff.staff_name }}</p>
            <p><span class="font-medium">Date:</span> {{ date }}</p>
            <p><span class="font-medium">Time:</span> {{ formatTime(time) }}</p>
            <p><span class="font-medium">Name:</span> {{ name }}</p>
            <p><span class="font-medium">Email:</span> {{ email }}</p>
        </div>
        <div class="flex gap-3 mt-4">
            <template v-if="!confirmed">
                <AppButton @click="confirmBooking">Confirm Booking</AppButton>
                <AppButton variant="secondary" @click="router.push(`/book/${serviceId}/${staffId}/slotselection`)">Back</AppButton>
            </template>
            <AppButton v-else @click="router.push('/')">Back to Home</AppButton>
        </div>
        <ErrorMessage class = "mt-4" :message="error" />
    </PageWrapper>

</template>