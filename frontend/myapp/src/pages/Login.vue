<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { saveAuth } from "../auth.js";
import FormField from "../components/FormField.vue";
import AppButton from "../components/AppButton.vue";

const router = useRouter();
const username = ref("");
const password = ref("");
const error = ref("");

async function login() {
  error.value = "";
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username.value, password: password.value }),
  });

  const data = await res.json();

  if (!res.ok) {
    error.value = data.error || "Login failed";
    return;
  }

  saveAuth(data.token, data.role);

  if (data.role === "admin") {
    router.push("/admin");
  } else {
    router.push("/staff/dashboard");
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-8 w-full max-w-sm mx-4">
      <h1 class="text-2xl font-bold text-slate-800 mb-6">Sign In</h1>

      <form class="flex flex-col gap-4" @submit.prevent="login">
        <FormField id="username" label="Username" v-model="username" />
        <FormField id="password" label="Password" type="password" v-model="password" />

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

        <AppButton class="w-full mt-2" @click="login">Sign In</AppButton>
      </form>
    </div>
  </div>
</template>
