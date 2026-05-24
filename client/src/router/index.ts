import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomeView from '@/pages/HomeView.vue';
import DiscoverView from '@/pages/DiscoverView.vue';
import MatchView from '@/pages/MatchView.vue';
import StoriesView from '@/pages/StoriesView.vue';
import AlumniView from '@/pages/AlumniView.vue';
import GuidesView from '@/pages/GuidesView.vue';
import DashboardView from '@/pages/DashboardView.vue';
import LoginView from '@/pages/LoginView.vue';
import RegisterView from '@/pages/RegisterView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/discover', component: DiscoverView },
    { path: '/match', component: MatchView },
    { path: '/stories', component: StoriesView },
    { path: '/alumni', component: AlumniView },
    { path: '/guides', component: GuidesView },
    { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/login', component: LoginView, meta: { guestOnly: true } },
    { path: '/register', component: RegisterView, meta: { guestOnly: true } }
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' };
  }
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (!auth.bootstrapped) {
    await auth.init();
  }

  if (to.meta.requiresAuth && !auth.user) {
    return { path: '/login', query: { redirect: to.fullPath } };
  }

  if (to.meta.guestOnly && auth.user) {
    return { path: '/dashboard' };
  }
});

export default router;
