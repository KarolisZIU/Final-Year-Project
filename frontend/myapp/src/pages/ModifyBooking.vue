<script setup>
import { useRouter, useRoute } from "vue-router";
import NavBar from "../components/NavBar.vue";
import PageWrapper from "../components/PageWrapper.vue";
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
  <PageWrapper title="Select New Time For Your Booking"> </PageWrapper>
</template>
