<script setup>
import { useRouter } from "vue-router";
import { clearAuth } from "../auth.js";
import AppButton from "../components/AppButton.vue";
import PageWrapper from "../components/PageWrapper.vue";

const router = useRouter();

function logout() {
  clearAuth();
  router.push("/login");
}
</script>

<template>
  <PageWrapper title="Staff Dashboard" max-width="max-w-2xl">
    <p class="text-slate-500 -mt-4 mb-8">View your upcoming bookings</p>
    <div class="flex item-center justify-center mt-10">
      <AppButton variant="danger" @click="logout">
        Sign Out
      </AppButton>
    </div>

  </PageWrapper>

</template>
