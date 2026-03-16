<script setup>
defineProps({
  message: String,
});
</script>

<template>
  <div v-if="message">
    {{ message }}
  </div>
</template>
