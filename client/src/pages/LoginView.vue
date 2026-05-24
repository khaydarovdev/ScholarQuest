<template>
  <AuthCard
    mode="login"
    title="Welcome back"
    subtitle="Sign in to continue tracking scholarships, deadlines, and saved opportunities."
    :loading="loading"
    button-label="Log in"
    footer-text="New to ScholarQuest?"
    footer-link="/register"
    footer-link-label="Create an account"
    :message="errorMessage"
    tone="error"
    @submit="submit"
  >
    <InputField v-model="email" label="Email" type="email" placeholder="you@example.com" />
    <InputField v-model="password" label="Password" type="password" placeholder="••••••••" />
  </AuthCard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AuthCard from '@/components/auth/AuthCard.vue';
import InputField from '@/components/forms/InputField.vue';

const email = ref('demo@scholarquest.app');
const password = ref('ScholarQuest123!');
const loading = ref(false);
const errorMessage = ref('');
const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

async function submit() {
  loading.value = true;
  errorMessage.value = '';
  try {
    await auth.login({ email: email.value.trim(), password: password.value });
    await router.push((route.query.redirect as string) || '/dashboard');
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.message ?? 'Unable to log in right now.';
  } finally {
    loading.value = false;
  }
}
</script>
