<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageWrapper from "../components/PageWrapper.vue";
import AppButton from "../components/AppButton.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import NavBar from "../components/NavBar.vue";

const route = useRoute();
const router = useRouter();

const serviceId = computed(() => route.params.serviceId);

const staff = ref([]);
const error = ref("");

onMounted(async () => {
  try {
    const res = await fetch("/api/staff");
    if (!res.ok) {
      const data = await res.json();
      error.value = data.error || "Failed to load staff";
      return;
    }
    staff.value = await res.json();
  } catch (e) {
    error.value = "Failed to load staff";
  }
});

function selectStaff(member) {
  router.push(`/book/${serviceId.value}/${member.staff_id}/slotselection`);
}
</script>

<template>
  <NavBar />
  <PageWrapper title="Select a Staff Member">
    <ErrorMessage :message="error" />
    <button @click="router.back()">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="black"
        class="size-7 cursor-pointer hover:bg-black/10 rounded-full mb-2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
        />
      </svg>
    </button>
    <ErrorMessage :message="error" />
    <div class="flex flex-col gap-4">
      <div
        v-for="m in staff"
        :key="m.staff_id"
        class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between"
      >
        <div>
          <p class="font-semibold text-black text-lg">{{ m.staff_name }}</p>
        </div>
        <AppButton @click="selectStaff(m)">Select</AppButton>
      </div>
    </div>
  </PageWrapper>
</template>
