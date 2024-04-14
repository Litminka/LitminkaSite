import { defineStore } from 'pinia';
import { User } from 'src/components/models';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {} as User,
    }),
    getters: {},
    actions: {},
});
