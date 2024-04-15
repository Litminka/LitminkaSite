<template>
    <q-page padding>
        <q-form @submit="submit" @reset="reset" class="q-gutter-md">
            <q-input
                filled
                v-model="login"
                label="Your name *"
                hint="Name and surname"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Please type something']" />

            <q-input
                filled
                type="password"
                v-model="password"
                label="Your age *"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Please type something']" />

            <div>
                <q-btn label="Submit" type="submit" color="primary" />
            </div>
        </q-form>
    </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/user-store';
import { ref } from 'vue';
const store = useUserStore();

defineOptions({
    name: 'LoginPage',
});

const login = ref('');
const password = ref('');
const $q = useQuasar();
const userStore = useUserStore();

async function submit() {
    const response = await store.api.post('users/login', {
        login: login.value,
        password: password.value,
    });
    console.log($q);
    if (response.status === 422) {
        $q.notify({
            color: 'negative',
            position: 'bottom-right',
            message: `Не удалось войти в аккаунт: ${response.data.error}`,
            timeout: 1500,
        });
        return;
    }

    const data = response.data.body;
    $q.cookies.set('token', data.token);
    $q.cookies.set('refreshToken', data.refreshToken);
    $q.notify({
        color: 'info',
        position: 'bottom-right',
        message: 'Вы успешно вошли',
        timeout: 1500,
    });

    const res = await userStore.api.get('users/profile');
    userStore.user = res.data.body.user;
    store.router.push('/');
}

function reset() {
    login.value = '';
    password.value = '';
}
</script>
src/stores/user-store
