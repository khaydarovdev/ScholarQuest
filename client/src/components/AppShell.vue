<template>
  <div class="min-h-screen">
    <header class="sticky top-0 z-40 border-b border-white/10 bg-bg/72 backdrop-blur-2xl">
      <div class="container-xy flex h-20 items-center justify-between gap-4">
        <RouterLink to="/" class="group flex items-center gap-3">
          <div class="grid h-12 w-12 place-items-center rounded-[1.1rem] bg-white p-1 ring-1 ring-black/5 shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
            <img src="/scholarquest-logo.png" alt="ScholarQuest" class="h-full w-full object-contain" />
          </div>
          <div class="hidden sm:block">
            <div class="text-base font-semibold leading-none tracking-[-0.02em]">ScholarQuest</div>
            <div class="text-xs text-muted">Scholarship discovery, refined</div>
          </div>
        </RouterLink>

        <nav class="hidden items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] p-1 lg:flex">
          <NavLink to="/discover">Discover</NavLink>
          <NavLink to="/match">Smart Match</NavLink>
          <NavLink to="/stories">Stories</NavLink>
          <NavLink to="/alumni">Alumni</NavLink>
          <NavLink to="/guides">Guides</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </nav>

        <div class="flex items-center gap-2 sm:gap-3">
          <button
            @click="theme.toggle()"
            class="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-text transition hover:bg-white/10"
            :aria-label="theme.isLight ? 'Switch to dark mode' : 'Switch to light mode'"
          >
            <svg v-if="theme.isLight" viewBox="0 0 24 24" class="h-4 w-4 text-accent3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4.5"></circle>
              <path d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6"></path>
            </svg>
            <svg v-else viewBox="0 0 24 24" class="h-4 w-4 text-accent2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"></path>
            </svg>
            <span>{{ theme.isLight ? 'Dark' : 'Light' }} mode</span>
          </button>

          <div v-if="auth.user" class="hidden items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 sm:flex">
            <div class="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs font-semibold text-accent2">{{ initials }}</div>
            <div class="text-left">
              <div class="text-sm font-medium leading-tight">{{ auth.user.name }}</div>
              <div class="text-xs text-muted">{{ auth.user.profileComplete ? 'Profile ready' : 'Profile draft' }}</div>
            </div>
          </div>

          <RouterLink
            v-if="!auth.user"
            to="/login"
            class="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-text/90 transition hover:border-white/25 hover:bg-white/5"
          >
            Sign in
          </RouterLink>
          <RouterLink
            v-if="!auth.user"
            to="/register"
            class="rounded-full bg-white px-4 py-2 text-sm font-semibold text-bg transition hover:scale-[1.02]"
          >
            Create account
          </RouterLink>
          <button
            v-else
            @click="logout"
            class="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-text/90 transition hover:border-white/25 hover:bg-white/5"
          >
            Logout
          </button>
        </div>
      </div>

      <div class="container-xy pb-4 lg:hidden">
        <div class="flex flex-wrap items-center gap-2 overflow-x-auto soft-scrollbar rounded-full border border-white/10 bg-white/[0.03] p-2">
          <NavLink to="/discover">Discover</NavLink>
          <NavLink to="/match">Match</NavLink>
          <NavLink to="/stories">Stories</NavLink>
          <NavLink to="/alumni">Alumni</NavLink>
          <NavLink to="/guides">Guides</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </div>
      </div>
    </header>

    <main class="relative">
      <div class="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,rgba(124,165,255,0.16),transparent_45%)]"></div>
      <div class="pointer-events-none absolute inset-0 bg-grid opacity-[0.22]"></div>
      <slot />
    </main>

    <footer class="border-t border-white/10 py-8">
      <div class="container-xy flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="text-sm text-muted">ScholarQuest — scholarship discovery, matching, and tracking.</div>
        <div class="text-sm text-muted">Built for final deployment.</div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';
import NavLink from './NavLink.vue';

const auth = useAuthStore();
const theme = useThemeStore();

const initials = computed(() => auth.user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'SQ');

async function logout() {
  await auth.logout();
}
</script>
