<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppButton from "../components/AppButton.vue";
import FormField from "../components/FormField.vue";
import { authHeaders } from "../auth.js";
import ErrorMessage from "../components/ErrorMessage.vue";
const router = useRouter();

const newStaff = ref({
  name: "",
  username: "",
  password: "",
  role: "",
  schedule: [
    { dayOfWeek: "Monday", startTime: "", endTime: "" },
    { dayOfWeek: "Tuesday", startTime: "", endTime: "" },
    { dayOfWeek: "Wednesday", startTime: "", endTime: "" },
    { dayOfWeek: "Thursday", startTime: "", endTime: "" },
    { dayOfWeek: "Friday", startTime: "", endTime: "" },
    { dayOfWeek: "Saturday", startTime: "", endTime: "" },
    { dayOfWeek: "Sunday", startTime: "", endTime: "" },
  ]
});
const errorMessage = ref("");

function goBack() {
  router.push("/admin/staff");
}

async function addStaff() {
  errorMessage.value = "";
  const res = await fetch("/api/admin/staff", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      name: newStaff.value.name,
      username: newStaff.value.username,
      password: newStaff.value.password,
      role: newStaff.value.role
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    errorMessage.value = data.error;
    return;
  }
  const data = await res.json();
  const staffId = data.staffId;
  const filteredSchedule = newStaff.value.schedule.filter(day => day.startTime && day.endTime);

  if (filteredSchedule.length > 0) {
    await fetch(`/api/admin/staff/${staffId}/schedule`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ schedule: filteredSchedule }),
    });
  }
  router.push("/admin/staff");
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-8 w-full max-w-md mx-4">
      <h1 class="text-2xl font-bold text-slate-800 mb-6">Create New Staff Member</h1>

      <ErrorMessage :message="errorMessage" />

      <form class="flex flex-col gap-4" @submit.prevent="addStaff">
        <FormField id="name" label="Staff Name" v-model="newStaff.name" />
        <FormField id="username" label="Username" v-model="newStaff.username" />
        <FormField id="password" label="Password" type="password" v-model="newStaff.password" />
        <div>
  <label class="block text-sm font-medium text-slate-700 mb-2">Role</label>
  <select v-model="newStaff.role" class="w-full px-4 py-2 border border-slate-300 rounded-lg">
    <option value="">Select a role</option>
    <option value="staff">Staff</option>
    <option value="admin">Admin</option>
  </select>
</div>

<div class="border-t border-slate-200 pt-6 mt-4">
  <h2 class="text-lg font-semibold text-slate-800 mb-4">Weekly Schedule</h2>
  <div v-for="day in newStaff.schedule" :key="day.dayOfWeek" class="flex items-center gap-3 mb-3">
    <label class="w-24 text-sm font-medium text-slate-700">{{ day.dayOfWeek }}</label>
    <input type="time" v-model="day.startTime" class="px-3 py-2 border border-slate-300 rounded-lg">
    <input type="time" v-model="day.endTime" class="px-3 py-2 border border-slate-300 rounded-lg">
  </div>
</div>

        <div class="flex gap-3 pt-2">
          <AppButton @click="addStaff" class="flex-1">Add Staff</AppButton>
          <AppButton variant="secondary" @click="goBack" class="flex-1">Back</AppButton>
        </div>
      </form>
    </div>
  </div>
</template>