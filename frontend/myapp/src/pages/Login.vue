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
  <div>
    <div>
      <h1>Sign In</h1>

      <form @submit.prevent="login">
        <FormField id="username" label="Username" v-model="username" />
        <FormField id="password" label="Password" type="password" v-model="password" />

        <p v-if="error">{{ error }}</p>

        <AppButton @click="login">Sign In</AppButton>
      </form>
    </div>
  </div>
</template>
