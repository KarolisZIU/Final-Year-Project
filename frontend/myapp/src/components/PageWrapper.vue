<script setup>
defineProps({
  title: { type: String, required: true },
  maxWidth: { type: String, default: "max-w-3xl" },
  centered: { type: Boolean, default: false },
});
</script>

<template>
  <div>
    <div>
      <h1>{{ title }}</h1>
      <slot />
    </div>
  </div>
</template>
