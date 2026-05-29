<template>
  <NavBar />
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
  <SiteFooter />
</template>

<script setup>
import NavBar     from './components/NavBar.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>
