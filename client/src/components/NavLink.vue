<template>
  <RouterLink
    :to="to"
    class="rounded-full px-4 py-2 text-sm font-medium text-text/70 transition hover:bg-white/[0.04] hover:text-text"
    active-class="bg-white/[0.08] text-text"
  >
    <slot />
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

defineProps<{ to: string }>();
</script>
