<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

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
  <div style="padding: 20px">
    <h1>Select Staff</h1>

    <p>Selected serviceId: {{ serviceId }}</p>

    <p v-if="error">{{ error }}</p>

    <ul>
      <li v-for="m in staff" :key="m.staff_id" style="margin-bottom: 10px">
        {{ m.staff_name }}
        <button @click="selectStaff(m)">Select</button>
      </li>
    </ul>
  </div>
</template>