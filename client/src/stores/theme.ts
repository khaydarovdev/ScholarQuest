import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

type ThemeMode = 'dark' | 'light';

const KEY = 'sq_theme_mode';

function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('theme-light', mode === 'light');
  document.documentElement.style.colorScheme = mode;
}

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const saved = window.localStorage.getItem(KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>(getInitialMode());
  const isLight = computed(() => mode.value === 'light');

  function init() {
    applyTheme(mode.value);
  }

  function setMode(next: ThemeMode) {
    mode.value = next;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(KEY, next);
    }
    applyTheme(next);
  }

  function toggle() {
    setMode(mode.value === 'light' ? 'dark' : 'light');
  }

  return { mode, isLight, init, setMode, toggle };
});
