<script setup>
defineProps({
  variant: {
    type: String,
    default: "primary"
  },
  size: {
    type: String,
    default: "base"
  }
});

</script>

<template>
  <button
    type="button"
    :class="[
      {
        'bg-blue-500 hover:bg-blue-700 text-white': variant === 'primary',
        'bg-white border-1 border-slate-300 hover:bg-slate-200 text-black': variant === 'secondary',
        'bg-red-500 border-1 border-red-500 hover:bg-red-700 text-white': variant === 'danger',
        'bg-green-600 border-1 border-green-600 hover:bg-green-700 text-white': variant === 'success',

      },
      {
        'px-2 py-2 text-sm': size === 'sm',
        'px-5 py-3 text-base': size === 'base',
        'px-6 py-4 text-lg': size === 'md',
        'px-8 py-5 text-xl': size === 'lg',
      },
    ]"
    class="font-semibold rounded-lg transition cursor-pointer shadow-md text-center"
  >
    <slot />
  </button>
</template>
