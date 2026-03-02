<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const serviceId = computed(() => route.params.serviceId);
const staffId = computed(() => route.params.staffId);
</script>

<template>
  <div style="padding: 20px">
    <h1>Booking Summary (Dummy)</h1>

    <p><strong>Service ID:</strong> {{ serviceId }}</p>
    <p><strong>Staff ID:</strong> {{ staffId }}</p>

    <p>This page will later show date/time selection and confirmation.</p>
  </div>
</template>