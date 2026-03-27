<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageWrapper from "../components/PageWrapper.vue";
import AppButton from "../components/AppButton.vue";
import FormField from "../components/FormField.vue";

const route = useRoute();
const router = useRouter();

const serviceId = computed(() => route.params.serviceId);
const staffId = computed(() => route.params.staffId);

const selectedDate = ref("");
const availableSlots = ref([]);
const selectedSlot = ref(null);
const name = ref("");
const email = ref("");
const error = ref("");

function formatTime(isoString){
    return new Date(isoString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
}
function nextStep(){
    if (!name.value || !email.value) {
        error.value = "Please enter your name and email";
        return;
    }
    else if (!email.value.includes("@")) {
        error.value = "Please enter a valid email address";
        return;
    }
    router.push(`/book/${serviceId.value}/${staffId.value}/summary?date=${selectedDate.value}&time=${formatTime(selectedSlot.value)}&name=${name.value}&email=${email.value}`);

    }
async function fetchSlots(){
    try {
        const res = await fetch(`/api/booking/slots?serviceId=${serviceId.value}&staffId=${staffId.value}&date=${selectedDate.value}`);
        if (!res.ok) {
        throw new Error("Failed to fetch slots");
        }
        const data = await res.json();
        availableSlots.value = data;
    } catch (e) {
        error.value = "Failed to load available slots";
    }
}
watch(selectedDate, () => {
  fetchSlots()
})
</script>

<template>
    <PageWrapper title="Select Date" max-width="max-w-2xl">
    <div class = "flex gap-8 bg-white">
        <div>
            <input type="date" min="today" v-model="selectedDate">
            
        </div>
        <div>
  <div v-if="availableSlots.length">
    <div v-for="slots in availableSlots" :key="slots">
      <AppButton @click="selectedSlot = slots">{{ formatTime(slots) }}</AppButton>
    </div>
  </div>
  <div v-else>
    <p>No available slots for selected date</p>
  </div>
    </div>
</div>
<div v-if="selectedSlot">
<p v-if="error">{{ error }}</p>
    <FormField id="name" label="Your Name" v-model="name" />
    <FormField id="email" label="Your Email" type="email" v-model="email" />
    <AppButton class="mt-4" @click="nextStep">Book Appointment</AppButton>
</div>

</PageWrapper>
</template>