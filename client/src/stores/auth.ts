import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import api from '@/services/api';

type User = {
  id: number;
  name: string;
  email: string;
  gpa?: number | null;
  major?: string | null;
  nationality?: string | null;
  interests?: string[] | null;
  degreeLevel?: string | null;
  targetCountry?: string | null;
  bio?: string | null;
  profileComplete?: boolean;
};

type AuthResponse = {
  accessToken: string;
  user: User;
};

const STORAGE_KEY = 'sq_access';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const accessToken = ref<string>(localStorage.getItem(STORAGE_KEY) ?? '');
  const bootstrapped = ref(false);
  const isAuthed = computed(() => Boolean(user.value));

  function persist(token: string) {
    accessToken.value = token;
    localStorage.setItem(STORAGE_KEY, token);
  }

  function clearToken() {
    accessToken.value = '';
    localStorage.removeItem(STORAGE_KEY);
  }

  async function register(payload: { name: string; email: string; password: string }) {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    persist(data.accessToken);
    user.value = data.user;
    bootstrapped.value = true;
    return data.user;
  }

  async function login(payload: { email: string; password: string }) {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    persist(data.accessToken);
    user.value = data.user;
    bootstrapped.value = true;
    return data.user;
  }

  async function refreshSession() {
    try {
      const { data } = await api.post<AuthResponse>('/auth/refresh');
      persist(data.accessToken);
      user.value = data.user;
      bootstrapped.value = true;
      return true;
    } catch {
      clearToken();
      user.value = null;
      bootstrapped.value = true;
      return false;
    }
  }

  async function fetchMe() {
    if (!accessToken.value) {
      bootstrapped.value = true;
      return null;
    }

    try {
      const { data } = await api.get<{ user: User }>('/auth/me');
      user.value = data.user;
      bootstrapped.value = true;
      return data.user;
    } catch {
      const ok = await refreshSession();
      return ok ? user.value : null;
    }
  }

  async function init() {
    if (bootstrapped.value) return user.value;
    if (accessToken.value) {
      return fetchMe();
    }
    return refreshSession();
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      clearToken();
      user.value = null;
      bootstrapped.value = true;
    }
  }

  async function updateProfile(payload: Partial<User>) {
    const { data } = await api.put<{ user: User }>('/auth/profile', payload);
    user.value = data.user;
    return data.user;
  }

  return {
    user,
    accessToken,
    bootstrapped,
    isAuthed,
    register,
    login,
    logout,
    fetchMe,
    init,
    refreshSession,
    updateProfile
  };
});
