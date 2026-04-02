<script setup>
defineProps({
  title: { type: String, required: true },
  maxWidth: { type: String, default: "max-w-3xl" },
  centered: { type: Boolean, default: false },
});
</script>

<template>
  <div :class="[centered ? 'flex items-center justify-center' : '']">
    <div :class="[maxWidth, 'mx-auto px-6 py-10 w-full']">
      <h1 class="text-5xl font-semibold text-center text-white mb-10">{{ title }}</h1>
      <slot />
    </div>
  </div>
</template>
