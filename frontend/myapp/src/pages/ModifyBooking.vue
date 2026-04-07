<script setup>
import { useRouter, useRoute } from "vue-router";
import NavBar from "../components/NavBar.vue";
import PageWrapper from "../components/PageWrapper.vue";
import AppButton from "../components/AppButton.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import { ref, computed, watch } from "vue";
const router = useRouter();
const route = useRoute();

const bookingId = computed(() => route.params.bookingId);
const staffId = computed(() => route.query.staffId);
const serviceId = computed(() => route.query.serviceId);

const selectedDate = ref("");
const availableSlots = ref([]);
const selectedSlot = ref(null);
const formattedDate = ref("");
const slotError = ref("");

async function fetchSlots() {
  try {
    const res = await fetch(
      `/api/booking/slots?serviceId=${serviceId.value}&staffId=${staffId.value}&date=${formattedDate.value}`,
    );
    if (!res.ok) throw new Error("Failed to fetch slots");
    availableSlots.value = await res.json();
  } catch (e) {
    slotError.value = "Failed to load available slots";
  }
}

async function confirmModify(){
  if (!selectedSlot.value) {
    slotError.value = "Please select a new time slot";
    return;
  }
  try {
    const res = await fetch(`/api/booking/${bookingId.value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startTime: selectedSlot.value
      }),
    });
    if (!res.ok) throw new Error("Failed to modify booking");
    router.push("/manage-bookings");
  } catch (e) {
    slotError.value = "Failed to modify booking. Please try again.";
  }
}


function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

watch(selectedDate, (val) => {
  if (!val) return;
  slotError.value = "";
  availableSlots.value = [];
  selectedSlot.value = null;
  formattedDate.value = val.toLocaleDateString("en-CA");
  fetchSlots();
});
</script>

<template>
  <NavBar />
  <PageWrapper title="Select New Time For Your Booking"> 
  
  
      <div class="flex gap-23 bg-white rounded-xl">
      <div class="pl-15">
        <VDatePicker v-model="selectedDate" :min-date="new Date()" />
      </div>
      <div class="flex flex-col items-start justify-center">
        <ErrorMessage :message="slotError" />
        <div
          v-if="availableSlots.length"
          class="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto pb-2"
        >
          <AppButton
            v-for="slots in availableSlots"
            :key="slots"
            class="w-full"
            size="sm"
            :variant="selectedSlot === slots ? 'primary' : 'secondary'"
            @click="selectedSlot = slots"
            >{{ formatTime(slots) }}</AppButton
          >
        </div>
        <div v-else-if="selectedDate">
          <p class="text-gray-500 text-xl">
            No available slots for selected date
          </p>
        </div>
      </div>
</div>

<AppButton v-if="selectedSlot" variant="primary" @click="confirmModify" class="mt-4">Reschedule Booking</AppButton>
  </PageWrapper>
</template>
