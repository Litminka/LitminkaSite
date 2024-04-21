<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-toolbar-title>
                    <router-link class="brand-logo" :to="{ path: '/' }">Litminka</router-link>
                </q-toolbar-title>
                <q-separator vertical inset />

                <q-btn to="/anime/search" stretch flat label="Поиск" />
                <q-separator vertical inset />

                <q-btn to="/anime/top100" stretch flat label="Топ 100" />
                <q-separator vertical inset />
                <div v-if="store.user.id">
                    <div>Добро пожаловать {{ store.user.name }}:</div>
                    <q-btn @click="logout">Выйти</q-btn>
                </div>
                <div>Quasar v{{ $q.version }}</div>
            </q-toolbar>
        </q-header>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { Cookies, useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/user-store';

defineOptions({
    name: 'MainLayout',
    async preFetch({ store, currentRoute, redirect, ssrContext }) {
        const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies;
        const token = cookies.get('token');

        if (!token) {
            if (currentRoute.meta.auth) redirect('/login');
            return;
        }

        const userStore = useUserStore(store);

        if (!userStore.user.id) {
            const response = await userStore.api.get('users/profile');
            userStore.user = response.data.body;
        }
    },
});

const store = useUserStore();
const $q = useQuasar();

function logout() {
    $q.cookies.remove('token');
    $q.cookies.remove('refreshToken');
    store.$reset();
    store.router.go(0);
}
</script>

<style lang="scss">
.brand-logo {
    color: white;
    text-decoration: none;
}
</style>
