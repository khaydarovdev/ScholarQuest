<template>
  <div class="container-xy flex min-h-[calc(100vh-5rem)] items-center justify-center py-12">
    <form class="glass w-full max-w-xl rounded-[2rem] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.25)]" @submit.prevent="$emit('submit')">
      <div class="mb-6 flex items-center gap-3">
        <div class="grid h-12 w-12 place-items-center rounded-[1rem] bg-white p-1 ring-1 ring-black/5">
          <img src="/scholarquest-logo.png" alt="ScholarQuest" class="h-full w-full object-contain" />
        </div>
        <div>
          <div class="text-sm font-semibold tracking-[-0.02em]">ScholarQuest</div>
          <div class="text-xs text-muted">Scholarship discovery, refined</div>
        </div>
      </div>

      <div class="rounded-[1.25rem] border border-white/10 bg-[linear-gradient(135deg,rgba(126,166,255,0.12),rgba(131,244,218,0.08),rgba(255,196,112,0.06))] p-5">
        <SectionLabel>{{ mode }}</SectionLabel>
        <h1 class="mt-4 text-3xl font-semibold tracking-[-0.03em]">{{ title }}</h1>
        <p class="mt-3 text-sm leading-6 text-muted">{{ subtitle }}</p>
      </div>

      <div v-if="message" class="mt-6 rounded-2xl border px-4 py-3 text-sm" :class="toneClass">
        {{ message }}
      </div>

      <div class="mt-6 grid gap-4">
        <slot />
      </div>

      <button class="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-bg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60" :disabled="loading">
        {{ loading ? 'Please wait…' : buttonLabel }}
      </button>

      <div class="mt-6 text-center text-sm text-muted">
        {{ footerText }}
        <RouterLink :to="footerLink" class="font-semibold text-accent2 transition hover:text-white">{{ footerLinkLabel }}</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import SectionLabel from '@/components/SectionLabel.vue';

const props = defineProps<{
  mode: 'login' | 'register';
  title: string;
  subtitle: string;
  loading?: boolean;
  buttonLabel: string;
  footerText: string;
  footerLink: string;
  footerLinkLabel: string;
  message?: string;
  tone?: 'error' | 'success' | 'info';
}>();

defineEmits(['submit']);

const toneClass = computed(() => {
  if (props.tone === 'success') return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100';
  if (props.tone === 'info') return 'border-sky-400/20 bg-sky-400/10 text-sky-100';
  return 'border-rose-400/20 bg-rose-400/10 text-rose-100';
});
</script>
