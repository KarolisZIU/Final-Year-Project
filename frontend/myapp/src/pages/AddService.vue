<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authHeaders } from "../auth.js";
const router = useRouter();

const newService = ref({
  name: "",
  price: "",
  duration: ""
});
const errorMessage = ref("");

function goBack() {
  router.push("/admin/services");
}

async function addService() {
  errorMessage.value = "";
  const res = await fetch("/api/admin/services", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      name: newService.value.name,
      price: parseFloat(newService.value.price),
      duration: parseInt(newService.value.duration)
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    errorMessage.value = data.error;
    return;
  }

  router.push("/admin/services");
}
</script>

<template>
  <div>
    <div>
      <h1>Create New Service</h1>

      <div v-if="errorMessage">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="addService">
        <div>
          <label for="name">Service Name</label>
          <input id="name" type="text" v-model="newService.name" />
        </div>
        <div>
          <label for="price">Price (€)</label>
          <input id="price" type="number" step="0.01" min="0" v-model="newService.price" />
        </div>
        <div>
          <label for="duration">Duration (minutes)</label>
          <input id="duration" type="number" min="1" v-model="newService.duration" />
        </div>

        <div>
          <button @click="addService">Add Service</button>
          <button @click="goBack">Back</button>
        </div>
      </form>
    </div>
  </div>
</template>