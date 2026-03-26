<script setup>
defineProps({
  variant: {
    type: String,
    default: "primary"
  },
});

</script>

<template>
  <button
    type="button"
    :class="{
      'bg-indigo-600 hover:bg-indigo-800 text-white': variant === 'primary',
      'bg-white hover:bg-slate-400 text-slate-700 border border-slate-300': variant === 'secondary',
      'bg-red-500 hover:bg-red-800 text-white': variant === 'danger',
    }"
    class="font-semibold px-5 py-2 rounded-lg transition text-sm"
  >
    <slot />
  </button>
</template>
