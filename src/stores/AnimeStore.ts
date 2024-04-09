import { defineStore } from 'pinia';
import { Anime } from 'src/components/models';

export const useAnimeStore = defineStore('animeStore', {
    state: () => ({
        anime: {} as Anime,
    }),

    getters: {},

    actions: {},
});
