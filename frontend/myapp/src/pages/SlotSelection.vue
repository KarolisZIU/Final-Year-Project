<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageWrapper from "../components/PageWrapper.vue";
import AppButton from "../components/AppButton.vue";
import FormField from "../components/FormField.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import NavBar from "../components/NavBar.vue";

const route = useRoute();
const router = useRouter();

const serviceId = computed(() => route.params.serviceId);
const staffId = computed(() => route.params.staffId);

const selectedDate = ref("");
const availableSlots = ref([]);
const selectedSlot = ref(null);
const formattedDate = ref("");
const name = ref("");
const email = ref("");
const slotError = ref("");
const formError = ref("");

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
function nextStep() {
  if (!name.value || !email.value) {
    formError.value = "Please enter your name and email";
    return;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    formError.value = "Please enter a valid email address";
    return;
  }
  router.push(
    `/book/${serviceId.value}/${staffId.value}/summary?date=${formattedDate.value}&time=${encodeURIComponent(selectedSlot.value)}&name=${name.value}&email=${email.value}`,
  );
}
async function fetchSlots() {
  try {
    const res = await fetch(
      `/api/booking/slots?serviceId=${serviceId.value}&staffId=${staffId.value}&date=${formattedDate.value}`,
    );
    if (!res.ok) {
      throw new Error("Failed to fetch slots");
    }
    const data = await res.json();
    availableSlots.value = data;
  } catch (e) {
    slotError.value = "Failed to load available slots";
  }
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
  <PageWrapper title="Select Time For Your Booking">
    <ErrorMessage :message="error" />
    <button @click="router.back()">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="black"
        class="size-7 cursor-pointer hover:bg-black/10 rounded-full mb-2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
        />
      </svg>
    </button>
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
    <div v-if="selectedSlot" class="mt-10">
      <h2 class="text-2xl text-center font-semibold mb-4">
        Enter Your Details
      </h2>
      <ErrorMessage :message="formError" />
      <FormField id="name" label="Your Name" v-model="name" />
      <FormField id="email" label="Your Email" type="email" v-model="email" />
    </div>
    <div class="flex gap-3 mt-4">
      <AppButton v-if="selectedSlot" variant="primary" @click="nextStep"
        >Next</AppButton
      >
    </div>
  </PageWrapper>
</template>
