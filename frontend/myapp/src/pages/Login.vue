<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { saveAuth } from "../auth.js";
import FormField from "../components/FormField.vue";
import AppButton from "../components/AppButton.vue";
import ErrorMessage from "../components/ErrorMessage.vue";

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
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-[#C94C4C] rounded-xl border border-black shadow-sm p-8 w-full max-w-sm mx-4">
      <h1 class="text-2xl font-bold text-center text-black mb-6">Sign In</h1>

      <form class="flex flex-col gap-4" @submit.prevent="login">
        <FormField id="username" label="Username" v-model="username" />
        <FormField id="password" label="Password" type="password" v-model="password" />

        <ErrorMessage :message="error" />

        <AppButton class="w-full mt-2" type="submit">Sign In</AppButton>
      </form>
    </div>
    <div class="absolute top-4 right-4">
      <AppButton variant="secondary" @click="router.push('/')">Back to Home Page</AppButton>
    </div>
  </div>
</template>
