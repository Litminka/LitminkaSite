<template>
    <q-page class="row items-center justify-evenly">
        <div class="row" v-for="(single, i) in animeStore.anime.seasonal" v-bind:key="i">
            <anime-poster :anime="single"></anime-poster>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import AnimePoster from 'src/components/anime/AnimePoster.vue';
import { usePosterAnimeStore } from 'src/stores/PosterAnimeStore';

defineOptions({
    name: 'IndexPage',
    async preFetch({ store }) {
        const animeStore = usePosterAnimeStore(store);
        const data = await animeStore.api.get('anime/seasonal');
        animeStore.anime.seasonal = data.data.data;
    },
});

const animeStore = usePosterAnimeStore();
</script>
