<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-btn flat dense round icon="menu" aria-label="Menu" />

                <q-toolbar-title>Quasar App</q-toolbar-title>

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
import { User } from 'src/components/models';
import { useUserStore } from 'src/stores/user-store';

defineOptions({
    name: 'MainLayout',
    async preFetch({ store, currentRoute, redirect, ssrContext }) {
        const cookies = Cookies.parseSSR(ssrContext);
        const token = cookies.get('token');

        if (!token) {
            if (currentRoute.meta.auth) redirect('/login');
            return;
        }

        const userStore = useUserStore(store);
        const response = await userStore.api.get('users/profile');
        userStore.user = response.data.data.user;
    },
});

const store = useUserStore();
const $q = useQuasar();

function logout() {
    $q.cookies.remove('token');
    $q.cookies.remove('refreshToken');
    store.user = {} as User;
    store.router.go(0);
}
</script>
src/stores/user-store
