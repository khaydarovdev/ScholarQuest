<template>
  <div>
    <section class="relative overflow-hidden">
      <div class="absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(circle_at_top,rgba(124,165,255,0.18),transparent_48%)]"></div>
      <div class="container-xy grid min-h-[90vh] items-center gap-16 py-16 lg:grid-cols-[1.04fr_0.96fr]">
        <div class="max-w-3xl" data-reveal>
          <SectionLabel>Scholarships reimagined</SectionLabel>
          <h1 class="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
            Scholarship discovery that feels curated, not crowded.
          </h1>
          <p class="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Explore real opportunities, match against your academic profile, save scholarships for later review, and keep every deadline moving in one calm command center.
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <RouterLink to="/discover" class="rounded-full bg-white px-6 py-3 text-sm font-semibold text-bg transition hover:scale-[1.02]">
              Explore scholarships
            </RouterLink>
            <RouterLink to="/match" class="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-text transition hover:bg-white/10">
              Live match preview
            </RouterLink>
          </div>

          <div class="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            <div v-for="metric in metrics" :key="metric.label" class="glass rounded-3xl p-4 animate-floaty">
              <div class="text-2xl font-semibold">{{ metric.value }}</div>
              <div class="mt-1 text-sm text-muted">{{ metric.label }}</div>
            </div>
          </div>
        </div>

        <div class="relative" data-reveal>
          <div class="absolute -inset-8 rounded-full bg-accent/10 blur-3xl"></div>
          <div class="glass relative rounded-[2rem] border border-white/10 p-5 shadow-glow">
            <div class="flex items-center justify-between gap-3">
              <div>
                <div class="text-xs uppercase tracking-[0.2em] text-muted">Live recommendations</div>
                <div class="mt-2 text-xl font-semibold">{{ recommendationTitle }}</div>
              </div>
              <div class="rounded-full bg-white/5 px-3 py-1 text-xs text-accent2">{{ bestScore }}% match</div>
            </div>

            <div v-if="loadingMatches" class="mt-6 grid gap-4">
              <div v-for="i in 3" :key="i" class="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div class="h-4 w-36 rounded bg-white/10"></div>
                <div class="mt-4 h-2 rounded bg-white/10"></div>
              </div>
            </div>

            <div v-else class="mt-5 grid gap-4">
              <RouterLink v-for="item in preview" :key="item.id" to="/discover" class="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/[0.08]">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <div class="text-sm font-semibold text-white">{{ item.name }}</div>
                    <div class="mt-1 text-xs uppercase tracking-[0.18em] text-muted">{{ item.tag }}</div>
                  </div>
                  <div class="text-right text-sm text-accent2">{{ item.score }}%</div>
                </div>
                <div class="mt-3 h-2 rounded-full bg-white/10">
                  <div class="h-2 rounded-full bg-gradient-to-r from-accent to-accent2 animate-shimmer" :style="{ width: `${item.score}%` }"></div>
                </div>
              </RouterLink>
            </div>

            <div class="mt-5 grid grid-cols-2 gap-4">
              <div class="rounded-3xl border border-white/10 bg-panel/70 p-4">
                <div class="text-xs uppercase tracking-[0.2em] text-muted">Saved</div>
                <div class="mt-2 text-2xl font-semibold">{{ savedCount }}</div>
              </div>
              <div class="rounded-3xl border border-white/10 bg-panel/70 p-4">
                <div class="text-xs uppercase tracking-[0.2em] text-muted">Deadlines</div>
                <div class="mt-2 text-2xl font-semibold">{{ deadlineCount }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container-xy py-8 md:py-16">
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div v-for="feature in features" :key="feature.title" class="glass card-hover rounded-3xl p-6" data-reveal>
          <div class="text-sm font-semibold text-white">{{ feature.title }}</div>
          <p class="mt-3 text-sm leading-6 text-muted">{{ feature.copy }}</p>
        </div>
      </div>
    </section>

    <section class="container-xy py-12 md:py-20">
      <SectionTitle
        kicker="How it works"
        title="Everything students need, arranged with intention."
        subtitle="ScholarQuest combines discovery, matching, guidance, and tracking into one refined workflow."
      />
      <div class="mt-10 grid gap-4 lg:grid-cols-3">
        <div v-for="step in steps" :key="step.title" class="glass rounded-3xl p-6" data-reveal>
          <div class="text-xs uppercase tracking-[0.2em] text-muted">{{ step.kicker }}</div>
          <div class="mt-3 text-xl font-semibold">{{ step.title }}</div>
          <p class="mt-3 text-sm leading-6 text-muted">{{ step.copy }}</p>
        </div>
      </div>
    </section>

    <section class="container-xy py-12 md:py-20">
      <div class="glass grid gap-8 rounded-[2rem] p-8 lg:grid-cols-[1.1fr_0.9fr]" data-reveal>
        <div>
          <SectionLabel>Built for focus</SectionLabel>
          <h2 class="mt-4 text-3xl font-semibold tracking-tight">A dashboard that keeps the application process moving.</h2>
          <p class="mt-4 max-w-xl text-muted">
            See upcoming deadlines, update statuses, save scholarships instantly, and keep your strongest opportunities at the center of the experience.
          </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div class="text-xs uppercase tracking-[0.2em] text-muted">Deadline funnel</div>
            <div class="mt-3 text-3xl font-semibold">{{ deadlineCount }} days</div>
            <p class="mt-2 text-sm text-muted">Average time left on top tracked scholarships.</p>
          </div>
          <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div class="text-xs uppercase tracking-[0.2em] text-muted">Match quality</div>
            <div class="mt-3 text-3xl font-semibold">{{ bestScore }}%</div>
            <p class="mt-2 text-sm text-muted">Top live recommendation score for the current profile.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="container-xy py-12 md:py-24">
      <div class="rounded-[2rem] bg-gradient-to-br from-white/10 to-white/5 p-8 md:p-12">
        <div class="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <SectionLabel>Get started</SectionLabel>
            <h2 class="mt-4 text-3xl font-semibold tracking-tight">Build your student profile and start seeing better-fit scholarships immediately.</h2>
            <p class="mt-4 max-w-2xl text-muted">Sign in, fill out your academic profile, and let ScholarQuest assemble a curated shortlist.</p>
          </div>
          <RouterLink to="/register" class="inline-flex justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-bg transition hover:scale-[1.02]">
            Create account
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { useReveal } from '@/composables/useReveal';
import SectionLabel from '@/components/SectionLabel.vue';
import SectionTitle from '@/components/SectionTitle.vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';

useReveal();
const auth = useAuthStore();
const preview = ref<any[]>([]);
const loadingMatches = ref(false);
const savedCount = ref(0);
const deadlineCount = ref(0);

const metrics = computed(() => [
  { value: String(deadlineCount.value || 8), label: 'live scholarships' },
  { value: '6', label: 'matching signals' },
  { value: String(savedCount.value || 3), label: 'saved for review' }
]);

const features = [
  { title: 'Scholarship Discovery', copy: 'Search by country, field, degree level, funding amount, and deadlines with a focused filter experience.' },
  { title: 'Smart Matching', copy: 'Student profiles produce a scored shortlist with clear reasons, not vague suggestions.' },
  { title: 'Success Stories', copy: 'Real alumni journeys and program stories from scholarship communities and official pages.' },
  { title: 'Alumni Connect', copy: 'Browse alumni by program, country, and university with clear contact links.' }
];

const steps = [
  { kicker: '01', title: 'Create a profile', copy: 'Add GPA, major, nationality, interests, and target country in minutes.' },
  { kicker: '02', title: 'Shortlist opportunities', copy: 'Use filters or let the matching engine surface the best fits.' },
  { kicker: '03', title: 'Track the process', copy: 'Save, apply, and manage deadlines in one cohesive dashboard.' }
];

const recommendationTitle = computed(() => preview.value[0]?.name ?? 'Loading your shortlist…');
const bestScore = computed(() => preview.value[0]?.score ?? 0);

async function refreshRecommendations() {
  loadingMatches.value = true;
  try {
    const profile = auth.user && auth.user.profileComplete
      ? {
          gpa: auth.user.gpa,
          major: auth.user.major,
          nationality: auth.user.nationality,
          interests: auth.user.interests ?? [],
          degreeLevel: auth.user.degreeLevel,
          targetCountry: auth.user.targetCountry
        }
      : {
          gpa: 3.85,
          major: 'Computer Science',
          nationality: 'Kenya',
          interests: ['leadership', 'global development', 'AI for social good'],
          degreeLevel: 'Graduate',
          targetCountry: 'United Kingdom'
        };

    const [matchesRes, trackerRes] = await Promise.all([
      api.post('/matches', { ...profile, saveProfile: false }),
      auth.user ? api.get('/tracker/overview').catch(() => null) : Promise.resolve(null)
    ]);

    preview.value = matchesRes.data.matches.slice(0, 3).map((item: any) => ({
      id: item.id,
      name: item.name,
      tag: `${item.field} • ${item.country}`,
      score: item.score
    }));
    if (trackerRes?.data) {
      savedCount.value = trackerRes.data.counts.saved;
      deadlineCount.value = trackerRes.data.counts.upcoming;
    }
  } finally {
    loadingMatches.value = false;
  }
}

onMounted(refreshRecommendations);
watch(() => auth.user, refreshRecommendations, { deep: true });
</script>
