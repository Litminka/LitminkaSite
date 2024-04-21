import { defineStore } from 'pinia';
import { PosterAnime, SearchQuery } from 'src/components/models';

export const usePosterAnimeStore = defineStore('poster-anime', {
    state: () => ({
        anime: {
            seasonal: [] as PosterAnime[],
            announced: [] as PosterAnime[],
            popular: [] as PosterAnime[],
            top100: [] as PosterAnime[],
            search: [] as PosterAnime[],
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
        async search(query: SearchQuery) {
            const params = new URLSearchParams();
            params.set('page', (query.page ?? 1).toString());
            params.set('pageLimit', (query.pageLimit ?? 100).toString());

            const anime = await this.api.post(`anime?${params.toString()}`, {
                name: query.name ? query.name : undefined,
                seasons: query.seasons,
                statuses: query.statuses,
                rpaRatings: query.rpaRatings,
                mediaTypes: query.mediaTypes,
                includeGenres: this.toArray(query.includeGenres),
                excludeGenres: this.toArray(query.excludeGenres),
                period: query.period,
                withCensored: false,
            });
            this.anime.search = anime.data.body;
        },
        toArray(input?: number | number[]) {
            let result = undefined;
            let arg = input;
            if (typeof arg === 'string') {
                arg = [Number(arg)];
            }

            if (typeof arg === 'number') {
                arg = [arg];
            }
            if (arg && arg.length > 0) {
                result = arg.map((val) => Number(val));
            }
            return result;
        },
    },
});
