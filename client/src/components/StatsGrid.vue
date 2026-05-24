<template>
  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <div v-for="item in items" :key="item.label" class="glass rounded-[1.75rem] p-5 shadow-soft">
      <div class="text-[11px] uppercase tracking-[0.24em] text-muted">{{ item.label }}</div>
      <div class="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{{ item.value }}</div>
      <div class="mt-2 text-sm leading-6 text-muted">{{ item.note }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: { label: string; value: string; note: string }[];
}>();
</script>
