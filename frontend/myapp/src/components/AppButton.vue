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
  <button
    type="button"
    @click="$emit('click')"
    :class="{
      'bg-indigo-600 hover:bg-indigo-700 text-white': variant === 'primary',
      'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300': variant === 'secondary',
      'bg-red-50 hover:bg-red-100 text-red-600': variant === 'danger',
    }"
    class="font-semibold px-5 py-2 rounded-lg transition text-sm"
  >
    <slot />
  </button>
</template>
