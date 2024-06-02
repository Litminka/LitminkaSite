import { defineStore } from 'pinia';
import { Cookies } from 'quasar';
import { User } from 'src/components/models';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {} as User,
    }),
    getters: {
        isAuth(): boolean {
            return this.user.id !== undefined;
        },
    },
    actions: {
        signOut(cookies: Cookies) {
            cookies.remove('token');
            cookies.remove('refreshToken');
            this.$reset();
        },
    },
});
