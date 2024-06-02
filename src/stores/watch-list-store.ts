import { defineStore } from 'pinia';
import { WatchListWithAnime } from 'src/components/models';

export const useWatchListStore = defineStore('watchList', {
    state: () => ({
        watchList: [] as WatchListWithAnime[],
    }),

    getters: {},

    actions: {
        async getWatchList() {
            const response = await this.api.get('watch-list');
            this.watchList = response.data.body;
            console.log(this.watchList.length);
        },
    },
});
