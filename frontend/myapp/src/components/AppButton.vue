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
      'bg-[#3D5A40] border-1 border-solid border-black hover:bg-[#5A7A63] text-black': variant === 'primary',
      'bg-[#4A90A4] border-1 border-solid border-black hover:bg-slate-400  text-black': variant === 'secondary',
      'bg-red-400 border-1 border-solid border-black hover:bg-red-600 text-black': variant === 'danger',
      'bg-green-300 border-1 border-solid border-black hover:bg-green-500 text-black': variant === 'success',
    }"
    class="font-semibold px-5 py-2 rounded-lg transition text-sm"
  >
    <slot />
  </button>
</template>
