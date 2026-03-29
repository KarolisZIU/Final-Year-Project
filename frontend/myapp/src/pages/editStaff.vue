<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import AppButton from "../components/AppButton.vue";
import FormField from "../components/FormField.vue";
import { authHeaders } from "../auth.js";
import ErrorMessage from "../components/ErrorMessage.vue";

const router = useRouter();
const route = useRoute();
const staffId = route.params.id;

const staffData = ref({
  name: "",
  username: "",
  role: "",
  isActive: true,
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
}
const dayMapReverse = {
  1: "Monday", 2: "Tuesday", 3: "Wednesday",
  4: "Thursday", 5: "Friday", 6: "Saturday", 0: "Sunday"
};
onMounted(async () => {
  try {
    const res = await fetch(`/api/admin/staff/${staffId}`, {
      headers: authHeaders()
    });
    if (!res.ok) {
      errorMessage.value = "Failed to load staff member";
      return;
    }
    const data = await res.json();
    staffData.value.name = data.staff_name;
    staffData.value.username = data.staff_username;
    staffData.value.role = data.staff_role;
    staffData.value.isActive = data.is_active;
    
    // Prepopulate schedule
    if (data.schedule && data.schedule.length > 0) {
      data.schedule.forEach(s => {
const dayIndex = staffData.value.schedule.findIndex(d => d.dayOfWeek === dayMapReverse[s.day_of_week]);
        if (dayIndex !== -1) {
          staffData.value.schedule[dayIndex].startTime = s.start_time;
          staffData.value.schedule[dayIndex].endTime = s.end_time;
          staffData.value.schedule[dayIndex].isAvailable = true;
        }
      });
    }
  } catch (err) {
    errorMessage.value = "Failed to load staff member";
  }
});

function goBack() {
  router.push("/admin/staff");
}

async function updateStaff() {
  errorMessage.value = "";
  
  // Only send schedule for enabled days with times
const filteredSchedule = staffData.value.schedule
  .filter(day => day.isAvailable && day.startTime && day.endTime)
  .map(day => ({
    ...day,
    dayOfWeek: dayMap[day.dayOfWeek]
  }));
    
  const res = await fetch(`/api/admin/staff/${staffId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({
      name: staffData.value.name,
      username: staffData.value.username,
      role: staffData.value.role,
      isActive: staffData.value.isActive,
      schedule: filteredSchedule
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    errorMessage.value = data.error;
    return;
  }
  router.push("/admin/staff");
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-8 w-full max-w-md mx-4">
      <h1 class="text-2xl font-bold text-slate-800 mb-6">Edit Staff Member</h1>

      <ErrorMessage :message="errorMessage" />

      <form class="flex flex-col gap-4" @submit.prevent="updateStaff">
        <FormField id="name" label="Staff Name" v-model="staffData.name" />
        <FormField id="username" label="Username" v-model="staffData.username" />
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Role</label>
          <select v-model="staffData.role" class="w-full px-4 py-2 border border-slate-300 rounded-lg">
            <option value="">Select a role</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div class="flex items-center gap-3">
          <input type="checkbox" v-model="staffData.isActive" id="isActive" class="w-4 h-4 rounded" />
          <label for="isActive" class="text-sm font-medium text-slate-700 cursor-pointer">Active</label>
        </div>

        <div class="border-t border-slate-200 pt-6 mt-4">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Weekly Schedule</h2>
          <div v-for="day in staffData.schedule" :key="day.dayOfWeek" class="mb-4 p-4 border border-slate-200 rounded-lg">
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
          <AppButton @click="updateStaff" class="flex-1">Update</AppButton>
          <AppButton variant="secondary" @click="goBack" class="flex-1">Back</AppButton>
        </div>
      </form>
    </div>
  </div>
</template>
