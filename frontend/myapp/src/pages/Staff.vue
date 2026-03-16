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
  console.log("Selected staff:", member.staff_id, "for service:", serviceId.value);
}
</script>

<template>
  <PageWrapper title="Select a Staff Member" max-width="max-w-2xl">
    <p v-if="error">{{ error }}</p>

    <div>
      <div
        v-for="m in staff"
        :key="m.staff_id"
      >
        <div>
          <p>{{ m.staff_name }}</p>
          <p>{{ m.staff_role }}</p>
        </div>
        <AppButton @click="selectStaff(m)">Select</AppButton>
      </div>
    </div>
  </PageWrapper>
</template>