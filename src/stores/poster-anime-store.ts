import { defineStore } from 'pinia';
import { PosterAnime } from 'src/components/models';

export const usePosterAnimeStore = defineStore('poster-anime', {
    state: () => ({
        anime: {
            seasonal: [] as PosterAnime[],
            announced: [] as PosterAnime[],
            popular: [] as PosterAnime[],
            top100: [] as PosterAnime[],
        },
    }),

    getters: {},

    actions: {
        async getSeasonal() {
            const response = await this.api.get('anime/seasonal');
            this.anime.seasonal = response.data.body;
        },
        async getAnnounced() {
            const response = await this.api.get('anime/seasonal/announced');
            this.anime.announced = response.data.body;
        },
        async getPopular() {
            const response = await this.api.get('anime/seasonal/popular');
            this.anime.popular = response.data.body;
        },
        async getTop100() {
            const response = await this.api.get('anime/top');
            this.anime.top100 = response.data.body;
        },
    },
});
