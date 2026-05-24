
<template>
  <div class="container-xy py-10 md:py-14">
    <SectionLabel>Alumni connect</SectionLabel>
    <div class="mt-4 grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside class="glass rounded-[2rem] p-6 xl:sticky xl:top-20 xl:self-start xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto soft-scrollbar" data-reveal>
        <h1 class="text-3xl font-semibold tracking-[-0.03em]">Search alumni</h1>
        <p class="mt-3 text-sm text-muted">Connect with scholarship alumni across universities and countries.</p>

        <div class="mt-6 grid gap-4">
          <InputField v-model="search" label="Search" placeholder="Engineering, Toronto, design…" />
          <InputField v-model="country" label="Country" placeholder="Colombia" />
        </div>

        <div class="mt-6 grid gap-3">
          <button @click="load" class="w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-bg transition hover:scale-[1.01]">
            Filter alumni
          </button>
          <button @click="reset" class="w-full rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-text transition hover:bg-white/5">
            Show all alumni
          </button>
        </div>
      </aside>

      <section>
        <div v-if="alumni.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article v-for="a in alumni" :key="a.id" class="glass card-hover rounded-[2rem] p-5" data-reveal>
            <div class="flex items-center gap-4">
              <img :src="a.photoUrl" :alt="a.name" class="h-16 w-16 rounded-2xl object-cover" />
              <div>
                <div class="text-lg font-semibold">{{ a.name }}</div>
                <div class="text-sm text-muted">{{ a.university }}</div>
              </div>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <Chip>{{ a.scholarship }}</Chip>
              <Chip>{{ a.country }}</Chip>
            </div>
            <p class="mt-4 text-sm leading-6 text-muted">{{ a.bio }}</p>
            <a :href="contactHref(a.contact)" target="_blank" rel="noreferrer" class="mt-5 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5">
              Reach out
            </a>
          </article>
        </div>

        <div v-else class="glass rounded-[2rem] p-10 text-sm text-muted">
          No alumni match your filter. Use Show all alumni to restore the full directory.
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useReveal } from '@/composables/useReveal';
import SectionLabel from '@/components/SectionLabel.vue';
import InputField from '@/components/forms/InputField.vue';
import Chip from '@/components/Chip.vue';

useReveal();

const search = ref('');
const country = ref('');
const alumni = ref<any[]>([]);

function contactHref(value: string) {
  return value.startsWith('http') ? value : `mailto:${value}`;
}

async function load() {
  const { data } = await api.get('/alumni', { params: { search: search.value || undefined, country: country.value || undefined } });
  alumni.value = data.alumni;
}

function reset() {
  search.value = '';
  country.value = '';
  void load();
}

onMounted(load);
</script>
