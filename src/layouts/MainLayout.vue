<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-toolbar-title>
                    <router-link class="brand-logo" :to="{ path: '/' }">Litminka</router-link>
                </q-toolbar-title>
                <div class="flex">
                    <q-separator vertical inset />

                    <q-btn to="/anime/search" stretch flat label="Поиск" />
                    <q-separator vertical inset />

                    <q-btn to="/anime/top100" stretch flat label="Топ 100" />
                    <q-separator vertical inset />

                    <div class="flex" v-if="store.isAuth">
                        <q-btn to="/anime/watch-list" stretch flat label="Список" />
                        <q-separator vertical inset />
                        <q-btn to="/profile" flat stretch>Профиль: {{ store.user.name }}</q-btn>
                        <q-separator vertical inset />
                        <q-btn flat stretch @click="logout">Выйти</q-btn>
                    </div>
                    <div v-else>
                        <q-btn to="/login" stretch flat label="Войти" />
                        <q-separator vertical inset />
                    </div>
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
