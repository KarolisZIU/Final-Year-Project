<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { saveAuth } from "../auth.js";

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
        <div>
          <label for="username">Username</label>
          <input id="username" type="text" v-model="username" />
        </div>
        <div>
          <label for="password">Password</label>
          <input id="password" type="password" v-model="password" />
        </div>

        <p v-if="error">{{ error }}</p>

        <button @click="login">Sign In</button>
      </form>
    </div>
  </div>
</template>
