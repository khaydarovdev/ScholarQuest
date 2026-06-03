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
import AuthCard from '@/components/auth/AuthCard.vue';
import InputField from '@/components/forms/InputField.vue';
import { useAuthForm } from '@/composables/useAuthForm';

const email = ref('demo@scholarquest.app');
const password = ref('ScholarQuest123!');

const { loading, errorMessage, submit } = useAuthForm({
  action: (auth) => auth.login({ email: email.value.trim(), password: password.value }),
  fallbackError: 'Unable to log in right now.'
});
</script>
