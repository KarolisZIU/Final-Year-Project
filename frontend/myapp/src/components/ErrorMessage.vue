<script setup>
defineProps({
  message: String,
});
</script>

<template>
  <div v-if="message" class="mb-4 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
    {{ message }}
  </div>
</template>
