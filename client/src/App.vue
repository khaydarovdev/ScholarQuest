<template>
  <AppShell>
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </Transition>
    </RouterView>
  </AppShell>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppShell from '@/components/AppShell.vue';
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 420ms cubic-bezier(.16,1,.3,1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(18px) scale(0.985);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.985);
}
</style>
