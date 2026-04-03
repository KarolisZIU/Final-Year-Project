<script setup>
import NavBar from "../components/NavBar.vue";
import PageWrapper from "../components/PageWrapper.vue";
</script>

<template>
  <NavBar />
  <PageWrapper title="Klink's Barbers : Galway">
    <div class="flex flex-col justify-betweewn items-center gap-4">
      <div>123 Main Street, Galway, Ireland</div>
      <a
        href="https://maps.app.goo.gl/wFZwey54qLfmYBGMA"
        target="_blank"
        class="underline text-sm font-semibold"
        >Get Directions</a
      >

      <div class="flex flex-col gap-4 mt-10">
        <h1 class="font-bold text-2xl">Opening Hours</h1>
        <div>Monday, <span class="font-bold">09:00 - 20:00</span></div>
        <div>Tuesday, <span class="font-bold">09:00 - 20:00</span></div>
        <div>Wednesday, <span class="font-bold">09:00 - 20:00</span></div>
        <div>Thursday, <span class="font-bold">09:00 - 20:00</span></div>
        <div>Friday, <span class="font-bold">09:00 - 20:00</span></div>
        <div>Saturday, <span class="font-bold">09:00 - 18:00</span></div>
        <div>Sunday, <span class="font-bold">CLOSED</span></div>

        <div class="text-sm">
          Call us:
          <a href="tel:+35312345678" class="underline">+353 (0) 123 45678</a>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>
