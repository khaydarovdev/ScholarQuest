<template>
  <div class="container-xy py-10 md:py-14">
    <SectionLabel>Smart Match</SectionLabel>
    <div class="mt-4 grid gap-8 lg:grid-cols-[420px_1fr]">
      <form class="glass rounded-[2rem] p-6" @submit.prevent="runMatch" data-reveal>
        <h1 class="text-3xl font-semibold tracking-[-0.03em]">Build your student profile</h1>
        <p class="mt-3 text-sm leading-6 text-muted">The more precise the profile, the better the match quality.</p>

        <div class="mt-6 grid gap-4">
          <InputField v-model="profile.gpa" label="GPA" type="number" step="0.01" min="0" max="4" placeholder="3.85" />
          <InputField v-model="profile.major" label="Major" placeholder="Computer Science" />
          <InputField v-model="profile.nationality" label="Nationality" placeholder="Kenya" />
          <InputField v-model="interestsInput" label="Interests" placeholder="AI, climate, leadership" />
          <InputField v-model="profile.degreeLevel" label="Degree level" placeholder="Graduate" />
          <InputField v-model="profile.targetCountry" label="Target country" placeholder="Canada" />
        </div>

        <label class="mt-6 flex items-center gap-3 text-sm text-muted">
          <input v-model="saveProfile" type="checkbox" class="h-4 w-4 rounded border-white/20 bg-transparent" />
          Save this profile in my account
        </label>

        <button class="mt-6 w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-bg transition hover:scale-[1.01]" :disabled="loading">
          {{ loading ? 'Matching…' : 'Get matches' }}
        </button>
      </form>

      <section>
        <div class="flex items-end justify-between" data-reveal>
          <div>
            <h2 class="text-3xl font-semibold tracking-[-0.03em]">Your recommended scholarships</h2>
            <p class="mt-3 text-sm text-muted">Each match includes a clear score and the reasons behind it.</p>
          </div>
        </div>

        <div v-if="loading" class="mt-8 grid gap-5 md:grid-cols-2">
          <div v-for="i in 4" :key="i" class="glass animate-pulse rounded-[2rem] p-5">
            <div class="h-5 w-2/3 rounded bg-white/10"></div>
            <div class="mt-4 h-14 rounded bg-white/10"></div>
          </div>
        </div>

        <div v-else class="mt-8 grid gap-5 md:grid-cols-2">
          <article v-for="match in matches" :key="match.id" class="glass card-hover rounded-[2rem] p-5" data-reveal>
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="text-xs uppercase tracking-[0.22em] text-muted">{{ match.provider }}</div>
                <h3 class="mt-2 text-xl font-semibold tracking-[-0.02em]">{{ match.name }}</h3>
              </div>
              <div class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-accent2">
                {{ match.score }}%
              </div>
            </div>
            <div class="mt-4 h-2 rounded-full bg-white/10">
              <div class="h-2 rounded-full bg-gradient-to-r from-accent to-accent2" :style="{ width: `${match.score}%` }"></div>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <Chip v-for="reason in match.reasons" :key="reason">{{ reason }}</Chip>
            </div>
            <p class="mt-4 text-sm leading-6 text-muted">{{ match.description }}</p>
            <div class="mt-5 flex items-center justify-between text-sm">
              <span>{{ match.country }} · {{ match.degreeLevel }}</span>
              <button @click="apply(match.id)" class="rounded-full bg-white px-4 py-2 font-semibold text-bg transition hover:scale-[1.01]">
                Apply from match
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import api from '@/services/api';
import { useReveal } from '@/composables/useReveal';
import SectionLabel from '@/components/SectionLabel.vue';
import InputField from '@/components/forms/InputField.vue';
import Chip from '@/components/Chip.vue';
import { useAuthStore } from '@/stores/auth';

useReveal();
const auth = useAuthStore();

const profile = reactive({
  gpa: 3.85,
  major: 'Computer Science',
  nationality: 'Kenya',
  degreeLevel: 'Graduate',
  targetCountry: 'Canada'
});
const interestsInput = ref('AI, social impact, leadership');
const saveProfile = ref(false);
const loading = ref(false);
const matches = ref<any[]>([]);

async function runMatch() {
  loading.value = true;
  try {
    const interests = interestsInput.value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (saveProfile.value && auth.user) {
      await auth.updateProfile({
        gpa: Number(profile.gpa),
        major: profile.major,
        nationality: profile.nationality,
        interests,
        degreeLevel: profile.degreeLevel,
        targetCountry: profile.targetCountry
      });
    }

    const { data } = await api.post('/matches', {
      gpa: Number(profile.gpa),
      major: profile.major,
      nationality: profile.nationality,
      interests,
      degreeLevel: profile.degreeLevel,
      targetCountry: profile.targetCountry,
      saveProfile: saveProfile.value
    });

    matches.value = data.matches;
  } finally {
    loading.value = false;
  }
}

async function apply(id: number) {
  await api.post(`/scholarships/${id}/apply`, { notes: 'Application created from matching results.' });
}

onMounted(() => {
  if (auth.user) {
    profile.gpa = auth.user.gpa ?? profile.gpa;
    profile.major = auth.user.major ?? profile.major;
    profile.nationality = auth.user.nationality ?? profile.nationality;
    profile.degreeLevel = auth.user.degreeLevel ?? profile.degreeLevel;
    profile.targetCountry = auth.user.targetCountry ?? profile.targetCountry;
    interestsInput.value = Array.isArray(auth.user.interests) ? auth.user.interests.join(', ') : interestsInput.value;
  }
  void runMatch();
});
</script>
