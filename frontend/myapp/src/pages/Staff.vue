<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageWrapper from "../components/PageWrapper.vue";
import AppButton from "../components/AppButton.vue";

const route = useRoute();
const router = useRouter();

const serviceId = computed(() => route.params.serviceId);

const staff = ref([]);
const error = ref("");

onMounted(async () => {
  try {
    const res = await fetch("/api/staff");
    staff.value = await res.json();
  } catch (e) {
    error.value = "Failed to load staff";
  }
});

function selectStaff(member) {
  router.push(`/summary/${serviceId.value}/${member.staff_id}`);
}
</script>

<template>
  <PageWrapper title="Select a Staff Member" max-width="max-w-2xl">
    <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>

    <div class="flex flex-col gap-4">
      <div
        v-for="m in staff"
        :key="m.staff_id"
        class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between"
      >
        <div>
          <p class="font-semibold text-slate-800 text-lg">{{ m.staff_name }}</p>
          <p class="text-slate-500 text-sm">{{ m.staff_role }}</p>
        </div>
        <AppButton @click="selectStaff(m)">Select</AppButton>
      </div>
    </div>
  </PageWrapper>
</template>