<template>
  <div class="app-shell">
    <NavBar />
    <div class="app-content">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
    <SiteFooter />
  </div>
</template>

<script setup>
import NavBar     from './components/NavBar.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<style>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.app-content {
  flex: 1;
  background: var(--navy2);
}
</style>
