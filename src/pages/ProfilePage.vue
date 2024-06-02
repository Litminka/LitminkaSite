<template>
    <q-page padding>
        <div>
            <div>{{ store.user.login }}</div>
            <div>{{ store.user.email }}</div>
            <div>{{ store.user.id }}</div>
            <!-- <div>Роль: {{ store.user.role.name }}</div> -->
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { useUserStore } from 'src/stores/user-store';

defineOptions({
    name: 'ProfilePage',
});

const store = useUserStore();
</script>
