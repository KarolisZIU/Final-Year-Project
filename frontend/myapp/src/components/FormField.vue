<script setup>
defineProps({
  label: { type: String, required: true },
  id: { type: String, required: true },
  type: { type: String, default: "text" },
  modelValue: { type: [String, Number], default: "" },
  step: { type: String, default: undefined },
  min: { type: String, default: undefined },
});

defineEmits(["update:modelValue"]);
</script>

<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-black mb-1">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :step="step"
      :min="min"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
</template>
