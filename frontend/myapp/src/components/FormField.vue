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
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :step="step"
      :min="min"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>
