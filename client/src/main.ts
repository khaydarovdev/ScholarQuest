
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './styles.css';
import { useThemeStore } from '@/stores/theme';

const app = createApp(App);
const pinia = createPinia();
const theme = useThemeStore(pinia);
theme.init();

app.use(pinia);
app.use(router);
app.mount('#app');
