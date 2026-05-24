
<template>
  <div class="container-xy py-10 md:py-14">
    <div class="grid gap-8 xl:grid-cols-[280px_1fr]">
      <aside class="glass soft-scrollbar rounded-[2rem] p-5 xl:sticky xl:top-20 xl:h-[calc(100vh-6rem)] xl:self-start xl:overflow-y-auto" data-reveal>
        <div class="flex items-start justify-between gap-4">
          <div>
            <SectionLabel>Discovery</SectionLabel>
            <h1 class="mt-4 text-3xl font-semibold tracking-[-0.03em]">Scholarship search</h1>
            <p class="mt-3 text-sm leading-6 text-muted">Filter by field, country, deadline, funding amount, and degree level.</p>
          </div>
          <div class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-accent2">{{ pagination.total }} found</div>
        </div>

        <div class="mt-6 grid gap-4">
          <InputField v-model="filters.search" label="Search" placeholder="Leadership, AI, arts…" />
          <InputField v-model="filters.field" label="Field of study" placeholder="Computer Science" />
          <InputField v-model="filters.country" label="Country" placeholder="United Kingdom" />
          <InputField v-model="filters.degreeLevel" label="Degree level" placeholder="Graduate" />
          <InputField v-model="filters.provider" label="Provider" placeholder="Gates Cambridge" />
          <InputField v-model="filters.minAmount" label="Minimum amount" type="number" placeholder="25000" />
          <InputField v-model="filters.maxAmount" label="Maximum amount" type="number" placeholder="50000" />
          <InputField v-model="filters.deadlineAfter" label="Deadline after" type="date" />
          <InputField v-model="filters.deadlineBefore" label="Deadline before" type="date" />
        </div>

        <div class="mt-6 flex flex-wrap gap-2">
          <button v-for="sort in sorts" :key="sort.value" @click="filters.sort = sort.value; applyFilters()" class="rounded-full border px-4 py-2 text-xs transition" :class="filters.sort === sort.value ? 'border-white/20 bg-white text-bg' : 'border-white/10 bg-white/5 text-text hover:bg-white/10'">
            {{ sort.label }}
          </button>
        </div>

        <div class="mt-6 grid gap-3">
          <button @click="applyFilters" class="w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-bg transition hover:scale-[1.01]">
            Apply filters
          </button>
          <button @click="resetFilters" class="w-full rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-text transition hover:bg-white/5">
            Reset to all scholarships
          </button>
        </div>

        <button v-if="auth.user" @click="showCreate = !showCreate" class="mt-4 w-full rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5">
          {{ showCreate ? 'Hide add form' : 'Add scholarship' }}
        </button>

        <div v-if="showCreate && auth.user" class="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
          <div class="text-xs uppercase tracking-[0.24em] text-muted">Add scholarship</div>
          <div class="mt-4 grid gap-4">
            <InputField v-model="createForm.name" label="Name" placeholder="New scholarship" />
            <InputField v-model="createForm.provider" label="Provider" placeholder="Organization" />
            <InputField v-model="createForm.country" label="Country" placeholder="Germany" />
            <InputField v-model="createForm.field" label="Field" placeholder="Engineering" />
            <InputField v-model="createForm.degreeLevel" label="Degree level" placeholder="Graduate" />
            <InputField v-model="createForm.amount" label="Amount" type="number" placeholder="25000" />
            <InputField v-model="createForm.deadline" label="Deadline" type="date" />
            <InputField v-model="createForm.url" label="Official URL" placeholder="https://…" />
            <InputField v-model="createForm.description" label="Description" type="textarea" placeholder="Write a useful summary..." />
            <button @click="createScholarship" :disabled="creating" class="rounded-full bg-accent px-4 py-3 text-sm font-semibold text-bg transition hover:brightness-110 disabled:opacity-50">
              {{ creating ? 'Adding…' : 'Add to discovery' }}
            </button>
          </div>
        </div>
      </aside>

      <section>
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between" data-reveal>
          <div>
            <SectionLabel>External scholarships</SectionLabel>
            <h2 class="mt-4 text-3xl font-semibold tracking-[-0.03em]">Browse curated opportunities</h2>
            <p class="mt-3 text-sm leading-6 text-muted">Real programs, live deadlines, and a details view for every opportunity.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button v-for="sort in sorts" :key="sort.value" @click="filters.sort = sort.value; applyFilters()" class="rounded-full border px-4 py-2 text-sm transition" :class="filters.sort === sort.value ? 'border-white/20 bg-white text-bg' : 'border-white/10 bg-white/5 text-text hover:bg-white/10'">
              {{ sort.label }}
            </button>
          </div>
        </div>

        <div v-if="loading" class="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div v-for="i in 6" :key="i" class="glass animate-pulse rounded-[2rem] p-5">
            <div class="h-40 rounded-3xl bg-white/10"></div>
            <div class="mt-4 h-4 w-32 rounded bg-white/10"></div>
            <div class="mt-3 h-5 w-3/4 rounded bg-white/10"></div>
            <div class="mt-3 h-14 rounded bg-white/10"></div>
          </div>
        </div>

        <div v-else-if="scholarships.length" class="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ScholarshipCard
            v-for="scholarship in scholarships"
            :key="scholarship.id"
            :scholarship="scholarship"
            :image="heroImage(scholarship)"
            :saved="savedLookup.has(scholarship.id)"
            @toggle-save="toggleSave"
            @view="openScholarship"
            data-reveal
          />
        </div>

        <div v-else class="mt-8 rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-10 text-center text-sm text-muted">
          No scholarships matched these filters. Reset filters to show the full scholarship library.
        </div>

        <div class="mt-8 flex items-center justify-between">
          <button @click="prevPage" :disabled="pagination.page <= 1" class="rounded-full border border-white/10 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40">
            Previous
          </button>
          <div class="text-sm text-muted">Page {{ pagination.page }} of {{ pagination.pages }}</div>
          <button @click="nextPage" :disabled="pagination.page >= pagination.pages" class="rounded-full border border-white/10 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40">
            Next
          </button>
        </div>
      </section>
    </div>

    <ScholarshipModal
      :scholarship="activeScholarship"
      :image="activeScholarship ? heroImage(activeScholarship) : ''"
      :saved="activeScholarship ? savedLookup.has(activeScholarship.id) : false"
      :review-later="activeScholarship ? reviewLaterLookup.has(activeScholarship.id) : false"
      @close="activeScholarship = null"
      @toggle-save="toggleSave"
      @toggle-review-later="toggleReviewLater"
      @apply="applyScholarship"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { useReveal } from '@/composables/useReveal';
import api from '@/services/api';
import ScholarshipCard from '@/components/ScholarshipCard.vue';
import ScholarshipModal from '@/components/ScholarshipModal.vue';
import SectionLabel from '@/components/SectionLabel.vue';
import InputField from '@/components/forms/InputField.vue';
import { useAuthStore } from '@/stores/auth';

useReveal();
const auth = useAuthStore();

type Scholarship = {
  id: number;
  name: string;
  description: string;
  amount: number;
  currency: string;
  deadline: string;
  country: string;
  field: string;
  degreeLevel: string;
  provider: string;
  url: string;
  guide?: any;
  _count?: { savedBy: number; applications: number; stories: number };
};

const scholarships = ref<Scholarship[]>([]);
const loading = ref(false);
const creating = ref(false);
const showCreate = ref(false);
const activeScholarship = ref<Scholarship | null>(null);
const savedLookup = ref(new Set<number>());
const reviewLaterLookup = ref(new Set<number>());
const pagination = reactive({ page: 1, limit: 9, total: 0, pages: 1 });
const filters = reactive({
  search: '',
  field: '',
  country: '',
  provider: '',
  degreeLevel: '',
  minAmount: '',
  maxAmount: '',
  deadlineBefore: '',
  deadlineAfter: '',
  sort: 'deadline_asc'
});

const createForm = reactive({
  name: '',
  provider: '',
  country: '',
  field: '',
  degreeLevel: '',
  amount: 0,
  deadline: '',
  url: '',
  description: ''
});

const sorts = [
  { label: 'Deadline soonest', value: 'deadline_asc' },
  { label: 'Deadline latest', value: 'deadline_desc' },
  { label: 'Largest amount', value: 'amount_desc' },
  { label: 'Newest', value: 'recent' }
] as const;

function heroImage(s: Scholarship) {
  const key = `${s.provider} ${s.field}`.toLowerCase();
  const images: Record<string, string> = {
    'schwarzman scholars global affairs': 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    'gates cambridge any field': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    'rhodes trust any field': 'https://images.unsplash.com/photo-1492486162576-62a5d3e2fcf5?auto=format&fit=crop&w=1200&q=80',
    'chevening any field': 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
    'european commission multidisciplinary': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    'daad development studies': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    'cambridge trust any field': 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80'
  };
  return images[key] ?? `https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80`;
}

function normalizedParams() {
  const entries = Object.entries(filters).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value] as const);
  return Object.fromEntries(entries.filter(([, v]) => v !== ''));
}

async function loadScholarships() {
  loading.value = true;
  try {
    const params = {
      ...normalizedParams(),
      page: pagination.page,
      limit: pagination.limit
    };
    const { data } = await api.get('/scholarships', { params });
    scholarships.value = data.items;
    pagination.total = data.pagination.total;
    pagination.pages = data.pagination.pages;
  } finally {
    loading.value = false;
  }
}

async function loadSaved() {
  if (!auth.user) {
    savedLookup.value = new Set();
    reviewLaterLookup.value = new Set();
    return;
  }
  const { data } = await api.get('/tracker/saved');
  savedLookup.value = new Set(data.saved.map((item: any) => item.scholarship.id));
  reviewLaterLookup.value = new Set(data.saved.filter((item: any) => item.reviewLater).map((item: any) => item.scholarship.id));
}

async function toggleSave(id: number) {
  if (!auth.user) return;
  if (savedLookup.value.has(id)) {
    await api.delete(`/scholarships/${id}/save`);
  } else {
    await api.post(`/scholarships/${id}/save`);
  }
  await loadSaved();
}

async function toggleReviewLater(id: number) {
  if (!auth.user) return;
  const nextValue = !reviewLaterLookup.value.has(id);
  await api.patch(`/tracker/saved/${id}`, { reviewLater: nextValue });
  await loadSaved();
}

async function createScholarship() {
  creating.value = true;
  try {
    await api.post('/scholarships', {
      ...createForm,
      amount: Number(createForm.amount),
      isExternal: true,
      deadline: new Date(createForm.deadline).toISOString()
    });
    Object.assign(createForm, {
      name: '',
      provider: '',
      country: '',
      field: '',
      degreeLevel: '',
      amount: 0,
      deadline: '',
      url: '',
      description: ''
    });
    showCreate.value = false;
    pagination.page = 1;
    await loadScholarships();
  } finally {
    creating.value = false;
  }
}

function applyFilters() {
  pagination.page = 1;
  void loadScholarships();
}

function resetFilters() {
  Object.assign(filters, {
    search: '',
    field: '',
    country: '',
    provider: '',
    degreeLevel: '',
    minAmount: '',
    maxAmount: '',
    deadlineBefore: '',
    deadlineAfter: '',
    sort: 'deadline_asc'
  });
  pagination.page = 1;
  void loadScholarships();
}

async function applyScholarship(id: number) {
  await api.post(`/scholarships/${id}/apply`, { notes: 'Application started from ScholarQuest.' });
}

function openScholarship(scholarship: Scholarship) {
  activeScholarship.value = scholarship;
}

function prevPage() {
  if (pagination.page > 1) {
    pagination.page -= 1;
    void loadScholarships();
  }
}

function nextPage() {
  if (pagination.page < pagination.pages) {
    pagination.page += 1;
    void loadScholarships();
  }
}

watch(
  () => auth.user,
  () => { void loadSaved(); },
  { immediate: true, deep: true }
);

loadScholarships();
</script>
