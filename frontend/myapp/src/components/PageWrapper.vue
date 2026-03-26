<script setup>
defineProps({
  title: { type: String, required: true },
  maxWidth: { type: String, default: "max-w-3xl" },
  centered: { type: Boolean, default: false },
});
</script>

<template>
  <div :class="['min-h-screen', centered ? 'flex items-center justify-center' : '']">
    <div :class="[maxWidth, 'mx-auto px-6 py-10 w-full']">
      <h1 class="text-3xl font-bold text-black mb-6">{{ title }}</h1>
      <slot />
    </div>
  </div>
</template>
