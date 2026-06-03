<template>
  <AuthCard
    mode="register"
    title="Create your ScholarQuest account"
    subtitle="Build a profile once and use it to match, save, and track scholarships."
    :loading="loading"
    button-label="Create account"
    footer-text="Already have an account?"
    footer-link="/login"
    footer-link-label="Log in"
    :message="errorMessage"
    tone="error"
    @submit="submit"
  >
    <InputField v-model="name" label="Full name" placeholder="Amina Patel" />
    <InputField v-model="email" label="Email" type="email" placeholder="you@example.com" />
    <InputField v-model="password" label="Password" type="password" placeholder="At least 8 characters" />
  </AuthCard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AuthCard from '@/components/auth/AuthCard.vue';
import InputField from '@/components/forms/InputField.vue';
import { useAuthForm } from '@/composables/useAuthForm';

const name = ref('Amina Patel');
const email = ref('demo+new@scholarquest.app');
const password = ref('ScholarQuest123!');

const { loading, errorMessage, submit } = useAuthForm({
  action: (auth) => auth.register({ name: name.value.trim(), email: email.value.trim(), password: password.value }),
  redirectTo: '/dashboard',
  fallbackError: 'Unable to create the account right now.'
});
</script>
