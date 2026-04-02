<script setup>
defineProps({
  title: { type: String, required: true },
  maxWidth: { type: String, default: "max-w-3xl" },
  centered: { type: Boolean, default: false },
});
</script>

<template>
  <div :class="[centered ? 'flex items-center justify-center' : '', 'mt-30']">
    <div :class="[ maxWidth, 'mx-auto bg-white rounded-2xl shadow-xl/50 px-5 py-5 w-full']">
      <h1 class="text-3xl font-semibold text-center text-black mb-10">{{ title }}</h1>
      <slot />
    </div>
  </div>
</template>
