<template>
  <div>
    <SectionLabel>{{ kicker }}</SectionLabel>
    <h2 class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
      {{ title }}
    </h2>
    <p v-if="subtitle" class="mt-4 max-w-2xl text-base leading-7 text-muted">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
import SectionLabel from './SectionLabel.vue';

defineProps<{
  kicker: string;
  title: string;
  subtitle?: string;
}>();
</script>
