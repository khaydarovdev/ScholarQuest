<template>
  <div class="container-xy py-10 md:py-14">
    <SectionLabel>Success stories</SectionLabel>
    <div class="mt-4 flex items-end justify-between">
      <div>
        <h1 class="text-3xl font-semibold tracking-[-0.03em]">Student outcomes that feel real</h1>
        <p class="mt-3 text-sm text-muted">A refined gallery of stories, alumni victories, and the scholarships that unlocked them.</p>
      </div>
    </div>

    <div class="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <article v-for="story in stories" :key="story.id" class="glass card-hover overflow-hidden rounded-[2rem]" data-reveal>
        <img :src="story.photoUrl" :alt="story.studentName" class="h-64 w-full object-cover object-center" />
        <div class="p-5">
          <div class="text-xs uppercase tracking-[0.22em] text-muted">{{ story.university }}</div>
          <h3 class="mt-2 text-xl font-semibold">{{ story.studentName }}</h3>
          <div class="mt-3 text-sm text-accent2">{{ story.scholarship?.name }}</div>
          <p class="mt-4 text-sm leading-6 text-muted">{{ story.story }}</p>
          <div class="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-text/90">
            “{{ story.testimonial }}”
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useReveal } from '@/composables/useReveal';
import SectionLabel from '@/components/SectionLabel.vue';

useReveal();

const stories = ref<any[]>([]);

onMounted(async () => {
  const { data } = await api.get('/stories');
  stories.value = data.stories;
});
</script>
