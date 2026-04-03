<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { saveAuth } from "../auth.js";
import FormField from "../components/FormField.vue";
import AppButton from "../components/AppButton.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import NavBar from "../components/NavBar.vue";

const router = useRouter();
const username = ref("");
const password = ref("");
const error = ref("");

async function login() {
  error.value = "";
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    error.value = data.error || "Login failed";
    return;
  }

  saveAuth(data.token, data.role, data.name);

  if (data.role === "admin") {
    router.push("/admin");
  } else {
    router.push("/staff/dashboard");
  }
}
</script>

<template>
  <NavBar />
  <div class="min-h-screen flex items-center justify-center">
    <div
      class="bg-white text-start rounded-xl px-8 py-8 shadow-xl/30 w-full max-w-sm"
    >
      <h1 class="text-2xl font-bold text-center text-black mb-6">Sign In</h1>

      <form class="flex flex-col gap-4" @submit.prevent="login">
        <FormField id="username" label="Username" v-model="username" />
        <FormField
          id="password"
          label="Password"
          type="password"
          v-model="password"
        />

        <ErrorMessage :message="error" />

        <AppButton class="w-full mt-2" type="submit">Sign In</AppButton>
      </form>
    </div>
  </div>
</template>
