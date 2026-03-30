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
    { dayOfWeek: "Monday", isAvailable: false, startTime: "", endTime: "" },
    { dayOfWeek: "Tuesday", isAvailable: false, startTime: "", endTime: "" },
    { dayOfWeek: "Wednesday", isAvailable: false, startTime: "", endTime: "" },
    { dayOfWeek: "Thursday", isAvailable: false, startTime: "", endTime: "" },
    { dayOfWeek: "Friday", isAvailable: false, startTime: "", endTime: "" },
    { dayOfWeek: "Saturday", isAvailable: false, startTime: "", endTime: "" },
    { dayOfWeek: "Sunday", isAvailable: false, startTime: "", endTime: "" },
  ]
});
const errorMessage = ref("");

const dayMap = {
  Monday: 1, Tuesday: 2, Wednesday: 3,
  Thursday: 4, Friday: 5, Saturday: 6, Sunday: 0
};

function goBack() {
  router.push("/admin/staff");
}

async function addStaff() {
  errorMessage.value = "";
  try{
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
  const filteredSchedule = newStaff.value.schedule
  .filter(day => day.isAvailable && day.startTime && day.endTime)
  .map(day => ({
    ...day,
    dayOfWeek: dayMap[day.dayOfWeek]
  }));

  if (filteredSchedule.length > 0) {
    const scheduleRes = await fetch(`/api/admin/staff/${staffId}/schedule`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ schedule: filteredSchedule }),
    });
    if (!scheduleRes.ok) {
      errorMessage.value = "Staff created but failed to save schedule";
      return;
    }
  }
  router.push("/admin/staff");
  } catch (err) {
    errorMessage.value = "Failed to add staff member";
  }
}
</script>

<template>
  <div class="mt-10 mb-10 min-h-screen flex items-center justify-center">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-8 w-full max-w-md mx-4">
      <h1 class="text-2xl font-bold text-black mb-6">Create New Staff Member</h1>

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
  <div v-for="day in newStaff.schedule" :key="day.dayOfWeek" class="mb-4 p-4 border border-slate-200 rounded-lg">
    <div class="flex items-center gap-3 mb-3">
      <input 
        type="checkbox" 
        v-model="day.isAvailable" 
        :id="'toggle-' + day.dayOfWeek"
        class="w-4 h-4 rounded"
      >
      <label :for="'toggle-' + day.dayOfWeek" class="text-sm font-medium text-slate-700 cursor-pointer">
        {{ day.dayOfWeek }}
      </label>
    </div>
    <div v-if="day.isAvailable" class="flex items-center gap-3 ml-7">
      <input type="time" v-model="day.startTime" placeholder="Start time" class="px-3 py-2 border border-slate-300 rounded-lg">
      <span class="text-sm text-slate-500">to</span>
      <input type="time" v-model="day.endTime" placeholder="End time" class="px-3 py-2 border border-slate-300 rounded-lg">
    </div>
  </div>
</div>

        <div class="flex gap-3 pt-2">
          <AppButton type="submit" class="flex-1">Add Staff</AppButton>
          <AppButton variant="secondary" @click="goBack" class="flex-1">Back</AppButton>
        </div>
      </form>
    </div>
  </div>
</template>