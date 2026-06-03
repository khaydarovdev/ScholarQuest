<template>
  <div class="container-xy py-10 md:py-14">
    <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between" data-reveal>
      <div>
        <SectionLabel>Tracker dashboard</SectionLabel>
        <h1 class="mt-4 text-3xl font-semibold tracking-[-0.03em]">Your application command center</h1>
        <p class="mt-3 text-sm text-muted">Monitor saved scholarships, applications, upcoming deadlines, and profile preferences in one place.</p>
      </div>
      <RouterLink to="/discover" class="rounded-full border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5">
        Find more scholarships
      </RouterLink>
    </div>

    <div class="mt-8">
      <StatsGrid :items="stats" />
    </div>

    <div class="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section class="grid gap-4">
        <div class="glass rounded-[2rem] p-6" data-reveal>
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-xl font-semibold">Profile settings</h2>
            <button @click="saveProfile" class="rounded-full bg-white px-4 py-2 text-sm font-semibold text-bg transition hover:scale-[1.01]">Save profile</button>
          </div>
          <div class="mt-4 grid gap-3 md:grid-cols-2">
            <ProfileItem label="Name" :value="auth.user?.name ?? '—'" />
            <ProfileItem label="Email" :value="auth.user?.email ?? '—'" />
          </div>
          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <InputField v-model="profileDraft.gpa" label="GPA" type="number" step="0.01" min="0" max="4" placeholder="3.85" />
            <InputField v-model="profileDraft.major" label="Major" placeholder="Public Policy and Computer Science" />
            <InputField v-model="profileDraft.nationality" label="Nationality" placeholder="Kenya" />
            <InputField v-model="profileDraft.degreeLevel" label="Degree level" placeholder="Graduate" />
            <InputField v-model="profileDraft.targetCountry" label="Target country" placeholder="United Kingdom" />
            <InputField v-model="profileDraft.interests" label="Interests" type="textarea" placeholder="leadership, climate, AI" />
            <InputField v-model="profileDraft.bio" label="Bio" type="textarea" placeholder="Tell scholarships who you are and what you are building." />
          </div>
        </div>

        <div class="glass rounded-[2rem] p-6" data-reveal>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">Saved scholarships</h2>
            <span class="text-sm text-muted">{{ saved.length }}</span>
          </div>
          <div class="mt-4 grid gap-3">
            <div v-for="item in saved" :key="item.scholarship.id" class="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="font-semibold">{{ item.scholarship.name }}</div>
                  <div class="mt-1 text-sm text-muted">{{ item.scholarship.country }} · {{ item.scholarship.field }}</div>
                </div>
                <div class="flex items-center gap-2">
                  <button @click="toggleReviewLater(item)" class="rounded-full border border-white/10 px-3 py-1 text-xs transition hover:bg-white/5">
                    {{ item.reviewLater ? 'Review later' : 'Move to review later' }}
                  </button>
                  <button @click="unsave(item.scholarship.id)" class="text-sm text-accent2">Remove</button>
                </div>
              </div>
              <textarea v-model="item.noteDraft" class="mt-4 w-full rounded-2xl border border-white/10 bg-black/20 p-3 text-sm outline-none" rows="3" placeholder="Add a note for later"></textarea>
              <div class="mt-3 flex items-center justify-between gap-3">
                <span class="text-xs uppercase tracking-[0.22em] text-muted">{{ item.reviewLater ? 'Queued for later review' : 'Ready for shortlist' }}</span>
                <button @click="saveSavedNote(item)" class="rounded-full bg-white px-4 py-2 text-sm font-semibold text-bg">Save note</button>
              </div>
            </div>
            <div v-if="!saved.length" class="rounded-3xl border border-dashed border-white/10 p-6 text-sm text-muted">No saved scholarships yet.</div>
          </div>
        </div>
      </section>

      <section class="grid gap-4">
        <div class="glass rounded-[2rem] p-6" data-reveal>
          <h2 class="text-xl font-semibold">Applications</h2>
          <div class="mt-4 grid gap-3">
            <div v-for="app in applications" :key="app.id" class="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <div class="font-semibold">{{ app.scholarship.name }}</div>
                  <div class="mt-1 text-sm text-muted">{{ formatDate(app.scholarship.deadline) }}</div>
                </div>
                <span class="rounded-full border border-white/10 px-3 py-1 text-xs">{{ app.status }}</span>
              </div>
              <textarea v-model="app.notesDraft" class="mt-4 w-full rounded-2xl border border-white/10 bg-black/20 p-3 text-sm outline-none" rows="3" placeholder="Progress notes"></textarea>
              <div class="mt-3 flex items-center justify-between gap-3">
                <select v-model="app.statusDraft" class="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm">
                  <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
                </select>
                <button @click="saveApp(app)" class="rounded-full bg-white px-4 py-2 text-sm font-semibold text-bg">Update</button>
              </div>
            </div>
            <div v-if="!applications.length" class="rounded-3xl border border-dashed border-white/10 p-6 text-sm text-muted">No applications yet.</div>
          </div>
        </div>

        <div class="glass rounded-[2rem] p-6" data-reveal>
          <h2 class="text-xl font-semibold">Upcoming deadlines</h2>
          <div class="mt-4 grid gap-3">
            <div v-for="item in upcoming" :key="item.id" class="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4">
              <div>
                <div class="font-semibold">{{ item.name }}</div>
                <div class="mt-1 text-sm text-muted">{{ item.country }} · {{ item.field }}</div>
              </div>
              <div class="text-sm text-accent2">{{ formatDate(item.deadline) }}</div>
            </div>
            <div v-if="!upcoming.length" class="rounded-3xl border border-dashed border-white/10 p-6 text-sm text-muted">No deadlines to show.</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { useReveal } from '@/composables/useReveal';
import SectionLabel from '@/components/SectionLabel.vue';
import StatsGrid from '@/components/StatsGrid.vue';
import ProfileItem from '@/components/ProfileItem.vue';
import InputField from '@/components/forms/InputField.vue';
import { formatDate } from '@/utils/format';
import { parseInterests, formatInterests } from '@/utils/interests';

useReveal();

const auth = useAuthStore();
const saved = ref<any[]>([]);
const applications = ref<any[]>([]);
const upcoming = ref<any[]>([]);
const statuses = ['DRAFT', 'SAVED', 'APPLIED', 'INTERVIEW', 'AWARDED', 'REJECTED'];

const profileDraft = reactive({
  gpa: '',
  major: '',
  nationality: '',
  interests: '',
  degreeLevel: '',
  targetCountry: '',
  bio: ''
});

const stats = computed(() => [
  { label: 'Saved', value: String(saved.value.length), note: 'Opportunities under consideration' },
  { label: 'Applications', value: String(applications.value.length), note: 'Active tracked submissions' },
  { label: 'Upcoming', value: String(upcoming.value.length), note: 'Deadlines in your queue' },
  { label: 'Profile', value: auth.user?.profileComplete ? 'Complete' : 'Draft', note: 'Matching readiness' }
]);

async function load() {
  const { data } = await api.get('/tracker/overview');
  saved.value = data.saved.map((item: any) => ({
    ...item,
    noteDraft: item.note ?? ''
  }));
  applications.value = data.applications.map((a: any) => ({
    ...a,
    notesDraft: a.notes ?? '',
    statusDraft: a.status
  }));
  upcoming.value = data.upcoming;

  profileDraft.gpa = auth.user?.gpa?.toString() ?? '';
  profileDraft.major = auth.user?.major ?? '';
  profileDraft.nationality = auth.user?.nationality ?? '';
  profileDraft.interests = formatInterests(auth.user?.interests);
  profileDraft.degreeLevel = auth.user?.degreeLevel ?? '';
  profileDraft.targetCountry = auth.user?.targetCountry ?? '';
  profileDraft.bio = auth.user?.bio ?? '';
}

async function saveProfile() {
  const interests = parseInterests(profileDraft.interests);
  await auth.updateProfile({
    gpa: profileDraft.gpa ? Number(profileDraft.gpa) : null,
    major: profileDraft.major || null,
    nationality: profileDraft.nationality || null,
    interests,
    degreeLevel: profileDraft.degreeLevel || null,
    targetCountry: profileDraft.targetCountry || null,
    bio: profileDraft.bio || null
  });
  await load();
}

async function unsave(id: number) {
  await api.delete(`/tracker/saved/${id}`);
  await load();
}

async function saveSavedNote(item: any) {
  await api.patch(`/tracker/saved/${item.scholarship.id}`, {
    note: item.noteDraft,
    reviewLater: item.reviewLater
  });
  await load();
}

async function toggleReviewLater(item: any) {
  item.reviewLater = !item.reviewLater;
  await api.patch(`/tracker/saved/${item.scholarship.id}`, {
    reviewLater: item.reviewLater,
    note: item.noteDraft
  });
  await load();
}

async function saveApp(app: any) {
  await api.patch(`/tracker/applications/${app.id}`, {
    notes: app.notesDraft,
    status: app.statusDraft
  });
  await load();
}

onMounted(load);
</script>
