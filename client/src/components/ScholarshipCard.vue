<template>
  <article
    class="group glass card-hover overflow-hidden rounded-[2rem] outline-none"
    role="button"
    tabindex="0"
    @click="$emit('view', scholarship)"
    @keydown.enter.prevent="$emit('view', scholarship)"
    @keydown.space.prevent="$emit('view', scholarship)"
  >
    <div class="relative h-40 overflow-hidden">
      <img :src="image" :alt="scholarship.name" class="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      <div class="absolute inset-0 bg-gradient-to-t from-bg via-bg/15 to-transparent"></div>
      <div class="absolute left-4 top-4 flex items-center gap-2">
        <span class="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-white/90">
          {{ scholarship.provider }}
        </span>
        <span v-if="!isOpen" class="rounded-full border border-rose-400/20 bg-rose-500/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-rose-100">
          Closed
        </span>
      </div>
      <div class="absolute right-4 top-4 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs font-medium text-accent2">
        {{ fundingLabel }}
      </div>
    </div>

    <div class="p-5">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <div class="text-[11px] uppercase tracking-[0.24em] text-muted">{{ scholarship.field }}</div>
          <h3 class="mt-2 line-clamp-2 text-lg font-semibold leading-tight text-white">{{ scholarship.name }}</h3>
        </div>
      </div>

      <p class="mt-4 line-clamp-3 text-sm leading-6 text-muted">{{ scholarship.description }}</p>

      <div class="mt-5 flex flex-wrap gap-2">
        <Chip>{{ scholarship.country }}</Chip>
        <Chip>{{ scholarship.degreeLevel }}</Chip>
        <Chip>{{ deadlineLabel }}</Chip>
      </div>

      <div class="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <div class="text-xs text-muted">
          Deadline
          <div class="mt-1 text-sm font-medium text-white">{{ deadlineLabel }}</div>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="auth.user"
            @click.stop="$emit('toggle-save', scholarship.id)"
            class="rounded-full border border-white/10 px-3 py-2 text-xs font-medium transition hover:border-white/20 hover:bg-white/5"
          >
            {{ saved ? 'Liked' : 'Like' }}
          </button>
          <button
            @click.stop="$emit('view', scholarship)"
            class="rounded-full bg-white px-3 py-2 text-xs font-semibold text-bg transition hover:scale-[1.02]"
          >
            View
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Chip from './Chip.vue';

const auth = useAuthStore();

const props = defineProps<{
  scholarship: {
    id: number;
    name: string;
    description: string;
    amount: number;
    currency: string;
    deadline: string | Date;
    country: string;
    field: string;
    degreeLevel: string;
    provider: string;
  };
  image: string;
  saved?: boolean;
  compact?: boolean;
}>();

defineEmits(['toggle-save', 'view']);

const isOpen = computed(() => new Date(props.scholarship.deadline).getTime() >= Date.now());

const fundingLabel = computed(() => {
  if (!props.scholarship.amount) return 'Fully funded';
  return `${props.scholarship.currency} ${Number(props.scholarship.amount).toLocaleString()}`;
});

const deadlineLabel = computed(() => {
  const date = new Date(props.scholarship.deadline);
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
});
</script>
