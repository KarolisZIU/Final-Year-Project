<script setup>
defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (v) => ["primary", "secondary", "danger"].includes(v),
  },
});

defineEmits(["click"]);
</script>

<template>
  <button type="button" @click="$emit('click')">
    <slot />
  </button>
</template>
