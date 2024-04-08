import { defineStore } from 'pinia';

export const usePosterAnimeStore = defineStore('posterAnimeStore', {
    state: () => ({
        anime: {
            seasonal: [],
        },
    }),

    getters: {},

    actions: {},
});
