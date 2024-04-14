import { defineStore } from 'pinia';

export const usePosterAnimeStore = defineStore('poster-anime', {
    state: () => ({
        anime: {
            seasonal: [],
        },
    }),

    getters: {},

    actions: {},
});
