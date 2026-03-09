<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const newService = ref({
  name: "",
  price: "",
  duration: ""
});

function goBack() {
  router.push("/admin/services");
}

async function addService() {
  await fetch("/api/admin/services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: newService.value.name,
      price: parseFloat(newService.value.price),
      duration: parseInt(newService.value.duration)
    }),
  });
  
  router.push("/admin/services");
}
</script>

<template>
  <h1>Create New Service</h1>
  <form>
    <label for = 'name'>Service Name:</label><br>
    <input type="text" id="name" v-model="newService.name"><br>
    <label for = 'price'>Price (€):</label><br>
    <input type="number" id="price" v-model="newService.price" step="0.01" min="0"><br>
    <label for = 'duration'>Duration (minutes):</label><br>
    <input type="number" id="duration" v-model="newService.duration" min="1"><br>
    <button type="button" @click="addService">Add Service</button>
    <button type="button" @click="goBack">Back to Services</button>
  </form>
  </template>