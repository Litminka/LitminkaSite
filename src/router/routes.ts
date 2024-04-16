import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
    },
    {
        path: '/anime/top100',
        component: () => import('layouts/MainLayout.vue'),
        children: [{ path: '', component: () => import('src/pages/Top100.vue') }],
    },
    {
        path: '/anime/:slug',
        component: () => import('layouts/MainLayout.vue'),
        children: [{ path: '', component: () => import('pages/AnimeSingle.vue') }],
    },
    {
        path: '/login',
        component: () => import('layouts/MainLayout.vue'),
        children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
    },
    {
        path: '/profile',
        component: () => import('layouts/MainLayout.vue'),
        children: [{ path: '', component: () => import('pages/ProfilePage.vue') }],
        meta: {
            auth: true,
        },
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
    },
];

export default routes;
