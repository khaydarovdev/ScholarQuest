import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { extractApiError } from '@/utils/error';

export function useAuthForm(options: {
  action: (auth: ReturnType<typeof useAuthStore>) => Promise<unknown>;
  redirectTo?: string;
  fallbackError: string;
}) {
  const loading = ref(false);
  const errorMessage = ref('');
  const router = useRouter();
  const route = useRoute();
  const auth = useAuthStore();

  async function submit() {
    loading.value = true;
    errorMessage.value = '';
    try {
      await options.action(auth);
      const target = options.redirectTo ?? (route.query.redirect as string) ?? '/dashboard';
      await router.push(target);
    } catch (error: unknown) {
      errorMessage.value = extractApiError(error, options.fallbackError);
    } finally {
      loading.value = false;
    }
  }

  return { loading, errorMessage, submit };
}
