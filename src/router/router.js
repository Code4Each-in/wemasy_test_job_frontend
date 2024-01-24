import { createRouter, createWebHistory } from 'vue-router';
import Form from '../components/FormHtml.vue';

const routes = [
    {
        path: '/',
        component: Form,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;