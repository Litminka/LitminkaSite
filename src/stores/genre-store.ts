import { defineStore } from 'pinia';
import { Genre } from 'src/components/models';

export const useGenreStore = defineStore('genre-store', {
    state: () => ({
        genres: [] as Genre[],
    }),

    getters: {},

    actions: {
        async getGenres() {
            const response = await this.api.get('anime/genres');
            this.genres = response.data.body;
        },
    },
});
