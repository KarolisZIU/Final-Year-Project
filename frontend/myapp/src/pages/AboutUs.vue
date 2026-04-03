<script setup>
import NavBar from "../components/NavBar.vue";
import PageWrapper from "../components/PageWrapper.vue";
</script>

<template>
  <NavBar />
  <PageWrapper title="About Us">
    <div class="flex flex-col gap-6">
      <div>
        <h2 class="text-xl font-bold mb-2">Who We Are</h2>
        <p class="text-slate-600">Klink's Barbers has been serving the Galway community since 2010. We are a team of passionate and experienced barbers dedicated to making every client look and feel their best. Whether you're after a classic cut, a sharp fade, or a beard trim, we've got you covered.</p>
      </div>

      <div>
        <h2 class="text-xl font-bold mb-2">Our Mission</h2>
        <p class="text-slate-600">We believe a great haircut is more than just a trim — it's an experience. Our mission is to provide top-quality grooming services in a relaxed, welcoming environment where every client feels at home.</p>
      </div>

      <div>
        <h2 class="text-xl font-bold mb-2">Why Choose Us</h2>
        <ul class="flex flex-col gap-2 text-slate-600 list-disc list-inside">
          <li>Experienced and friendly barbers</li>
          <li>Easy online booking — pick your barber, service, and time</li>
          <li>Competitive pricing with no hidden fees</li>
          <li>Conveniently located in the heart of Galway</li>
          <li>Walk-ins welcome, appointments recommended</li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-bold mb-2">Visit Us</h2>
        <p class="text-slate-600">123 Main Street, Galway, Ireland. Open Monday to Saturday. Book your appointment online or give us a call.</p>
      </div>
    </div>
  </PageWrapper>
</template>
