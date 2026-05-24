<template>
  <div class="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
    <div class="text-[11px] uppercase tracking-[0.24em] text-muted">{{ label }}</div>
    <div class="mt-2 text-sm font-medium text-white">{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string }>();
</script>
