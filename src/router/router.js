import { createRouter, createWebHistory } from 'vue-router';
import ShowVariations from '../components/ShowVariations.vue';

const routes = [
    {
        path: '/',
        component: ShowVariations,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;