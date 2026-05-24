<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="scholarship"
        class="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 py-4 backdrop-blur-sm sm:items-center"
        @click.self="$emit('close')"
      >
        <div class="glass soft-scrollbar relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
          <div class="relative h-72 overflow-hidden rounded-t-[2rem]">
            <img :src="image" :alt="scholarship.name" class="h-full w-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent"></div>
            <button
              class="absolute right-4 top-4 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm font-medium text-white transition hover:bg-black/50"
              @click="$emit('close')"
            >
              Close
            </button>
            <div class="absolute bottom-5 left-5 right-5 grid gap-4 md:grid-cols-[1.1fr_0.9fr] md:items-end">
              <div>
                <div class="text-[11px] uppercase tracking-[0.26em] text-white/70">{{ scholarship.provider }}</div>
                <h2 class="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">{{ scholarship.name }}</h2>
                <p class="mt-3 max-w-2xl text-sm leading-6 text-white/80 md:text-base">{{ scholarship.description }}</p>
              </div>
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="rounded-3xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
                  <div class="text-[11px] uppercase tracking-[0.24em] text-white/60">Deadline</div>
                  <div class="mt-2 text-lg font-semibold text-white">{{ deadlineLabel }}</div>
                </div>
                <div class="rounded-3xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
                  <div class="text-[11px] uppercase tracking-[0.24em] text-white/60">Funding</div>
                  <div class="mt-2 text-lg font-semibold text-white">{{ fundingLabel }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid gap-6 p-6 md:p-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div class="grid gap-6">
              <div class="grid gap-3 sm:grid-cols-3">
                <div class="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                  <div class="text-[11px] uppercase tracking-[0.24em] text-muted">Country</div>
                  <div class="mt-2 text-sm font-medium text-white">{{ scholarship.country }}</div>
                </div>
                <div class="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                  <div class="text-[11px] uppercase tracking-[0.24em] text-muted">Field</div>
                  <div class="mt-2 text-sm font-medium text-white">{{ scholarship.field }}</div>
                </div>
                <div class="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                  <div class="text-[11px] uppercase tracking-[0.24em] text-muted">Degree</div>
                  <div class="mt-2 text-sm font-medium text-white">{{ scholarship.degreeLevel }}</div>
                </div>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                  <div class="text-[11px] uppercase tracking-[0.24em] text-muted">Why it stands out</div>
                  <ul class="mt-3 grid gap-2 text-sm leading-6 text-text/85">
                    <li v-for="item in highlights" :key="item">• {{ item }}</li>
                  </ul>
                </div>
                <div class="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                  <div class="text-[11px] uppercase tracking-[0.24em] text-muted">Actions</div>
                  <div class="mt-3 grid gap-3">
                    <button v-if="auth.user" @click="$emit('toggle-save', scholarship.id)" class="rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5">
                      {{ saved ? 'Remove from likes' : 'Like scholarship' }}
                    </button>
                    <button v-if="auth.user" @click="$emit('toggle-review-later', scholarship.id)" class="rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5">
                      {{ reviewLater ? 'Remove review later' : 'Review later' }}
                    </button>
                    <button v-if="auth.user" @click="$emit('apply', scholarship.id)" class="rounded-full bg-white px-4 py-3 text-sm font-semibold text-bg transition hover:scale-[1.01]">
                      Start application
                    </button>
                    <a :href="scholarship.url" target="_blank" rel="noreferrer" class="rounded-full border border-white/10 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-white/5">
                      Open official page
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <aside class="grid gap-4">
              <div class="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <div class="text-[11px] uppercase tracking-[0.24em] text-muted">Application guide</div>
                <h3 class="mt-2 text-xl font-semibold text-white">{{ guide?.title ?? 'No guide available yet' }}</h3>
                <div v-if="guide" class="mt-4 grid gap-3">
                  <div v-for="(step, idx) in guide.steps" :key="idx" class="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-text/85">
                    <span class="mr-2 text-accent2">{{ idx + 1 }}.</span>{{ step }}
                  </div>
                </div>
                <div v-else class="mt-4 rounded-2xl border border-dashed border-white/10 p-4 text-sm text-muted">
                  No guide has been attached yet for this scholarship.
                </div>
              </div>

              <div class="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <div class="text-[11px] uppercase tracking-[0.24em] text-muted">Deadline mindset</div>
                <p class="mt-3 text-sm leading-6 text-text/80">
                  {{ deadlineCopy }}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const props = defineProps<{
  scholarship: any | null;
  image: string;
  saved?: boolean;
  reviewLater?: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'toggle-save', id: number): void;
  (e: 'toggle-review-later', id: number): void;
  (e: 'apply', id: number): void;
}>();

const guide = computed(() => props.scholarship?.guide ?? null);
const fundingLabel = computed(() => {
  if (!props.scholarship?.amount) return 'Fully funded';
  return `${props.scholarship.currency} ${Number(props.scholarship.amount).toLocaleString()}`;
});

const deadlineLabel = computed(() => {
  if (!props.scholarship?.deadline) return 'TBA';
  return new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(props.scholarship.deadline));
});

const highlights = computed(() => {
  const items = [
    props.scholarship?.field ? `Aligned with ${props.scholarship.field}` : 'Field fit is flexible',
    props.scholarship?.degreeLevel ? `Best for ${props.scholarship.degreeLevel} applicants` : 'Level not restricted',
    props.scholarship?._count?.stories ? `${props.scholarship._count.stories} linked success stories` : 'Linked to success stories'
  ];
  return items.filter(Boolean);
});

const deadlineCopy = computed(() => {
  const deadline = props.scholarship?.deadline ? new Date(props.scholarship.deadline) : null;
  if (!deadline) return 'Keep the official page open and verify the deadline and document list before submitting.';
  if (deadline.getTime() < Date.now()) return 'This opportunity is currently closed or archived. It is still useful for understanding program structure and preparing for the next cycle.';
  return 'Keep the official page open, prepare documents early, and leave time for reference letters and transcript checks.';
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 220ms ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
