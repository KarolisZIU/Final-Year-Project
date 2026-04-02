<script setup>
import { useRouter } from 'vue-router'

defineProps({
  title: { type: String, required: true },
  maxWidth: { type: String, default: "max-w-3xl" },
  centered: { type: Boolean, default: false },
  showBack: { type: Boolean, default: false },
});

const router = useRouter()
</script>

<template>
  <div :class="[centered ? 'flex items-center justify-center' : '']">
    <div :class="[maxWidth, 'mx-auto px-6 py-10 w-full']">
      <button v-if="showBack" @click="router.back()" class="cursor-pointer mb-4 text-white hover:text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
          <path fill-rule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
        </svg>
      </button>
      <h1 class="text-5xl font-semibold text-center text-white mb-20">{{ title }}</h1>
      <slot />
    </div>
  </div>
</template>
