<template>
  <div class="container-xy py-10 md:py-14">
    <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <SectionLabel>Application guides</SectionLabel>
        <h1 class="mt-4 text-3xl font-semibold tracking-[-0.03em]">Every guide opens into a real plan.</h1>
        <p class="mt-3 max-w-2xl text-sm text-muted">Click a guide to open the full checklist, timeline, and document plan in the right rail.</p>
      </div>
      <div class="text-sm text-muted">{{ guides.length }} guides loaded</div>
    </div>

    <div class="mt-4 grid gap-6 lg:grid-cols-[1fr_380px]">
      <section class="grid gap-4">
        <article
          v-for="guide in guides"
          :key="guide.id"
          class="glass card-hover cursor-pointer rounded-[2rem] p-6 outline-none"
          tabindex="0"
          role="button"
          @click="selected = guide"
          @keydown.enter.prevent="selected = guide"
          @keydown.space.prevent="selected = guide"
          data-reveal
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="text-xs uppercase tracking-[0.24em] text-muted">{{ guide.scholarship?.name }}</div>
              <h2 class="mt-2 text-2xl font-semibold tracking-[-0.03em]">{{ guide.title }}</h2>
            </div>
            <span class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10">
              View
            </span>
          </div>
          <div class="mt-5 grid gap-3 md:grid-cols-2">
            <div>
              <div class="text-xs uppercase tracking-[0.24em] text-muted">Steps</div>
              <ol class="mt-3 grid gap-2 text-sm leading-6 text-text/85">
                <li v-for="(step, idx) in guide.steps" :key="idx">• {{ step }}</li>
              </ol>
            </div>
            <div>
              <div class="text-xs uppercase tracking-[0.24em] text-muted">Documents</div>
              <ul class="mt-3 grid gap-2 text-sm leading-6 text-text/85">
                <li v-for="(doc, idx) in guide.documentsNeeded" :key="idx">• {{ doc }}</li>
              </ul>
            </div>
          </div>
        </article>
      </section>

      <aside class="glass soft-scrollbar rounded-[2rem] p-6 sticky top-20 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto" data-reveal>
        <div class="text-xs uppercase tracking-[0.24em] text-muted">Selected guide</div>
        <h2 class="mt-3 text-2xl font-semibold tracking-[-0.03em]">{{ selected?.title ?? 'Select a guide' }}</h2>
        <p class="mt-4 text-sm leading-6 text-muted">
          {{ selected?.scholarship?.description ?? 'Open a guide to see a step-by-step timeline and document checklist.' }}
        </p>

        <div v-if="selected" class="mt-6 grid gap-4">
          <div class="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div class="text-xs uppercase tracking-[0.24em] text-muted">Timeline</div>
            <div class="mt-3 grid gap-3">
              <div v-for="(item, idx) in selected.timeline" :key="idx" class="flex gap-3">
                <div class="min-w-16 text-sm font-semibold text-accent2">{{ item.week }}</div>
                <div class="text-sm text-muted">{{ item.task }}</div>
              </div>
            </div>
          </div>
          <div class="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div class="text-xs uppercase tracking-[0.24em] text-muted">Documents needed</div>
            <ul class="mt-3 grid gap-2 text-sm leading-6 text-text/85">
              <li v-for="(doc, idx) in selected.documentsNeeded" :key="idx">• {{ doc }}</li>
            </ul>
          </div>
          <div class="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div class="text-xs uppercase tracking-[0.24em] text-muted">Steps</div>
            <ul class="mt-3 grid gap-2 text-sm leading-6 text-text/85">
              <li v-for="(step, idx) in selected.steps" :key="idx">• {{ step }}</li>
            </ul>
          </div>
          <button @click="selected = null" class="rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5">Clear selection</button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useReveal } from '@/composables/useReveal';
import SectionLabel from '@/components/SectionLabel.vue';

useReveal();

const guides = ref<any[]>([]);
const selected = ref<any | null>(null);

onMounted(async () => {
  const { data } = await api.get('/guides');
  guides.value = data.guides;
  selected.value = data.guides[0] ?? null;
});
</script>
