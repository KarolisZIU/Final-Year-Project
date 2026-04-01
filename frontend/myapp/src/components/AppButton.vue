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
      'bg-blue-500 hover:bg-blue-700 text-white ': variant === 'primary',
      'bg-white border-1 border-slate-300 hover:bg-slate-200 text-black': variant === 'secondary',
      'bg-red-500 border-1 border-red-500 hover:bg-red-700 text-white': variant === 'danger',
      'bg-green-600  border-1 border-green-600 hover:bg-green-700 text-white': variant === 'success',
    }"
    class="font-semibold px-5 py-2 rounded-lg transition text-sm cursor-pointer shadow-md"
  >
    <slot />
  </button>
</template>
