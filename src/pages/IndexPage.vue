<template>
    <q-page>
        <div class="text-left q-pa-lg text-h3">Популярные аниме сезона</div>
        <custom-carousel :items-per-page="5" :items="animeStore.anime.popular" />
        <div class="text-left q-pa-lg text-h3">Сейчас выходят</div>
        <custom-carousel :items-per-page="6" :items="animeStore.anime.seasonal" />
        <div class="text-left q-pa-lg text-h3">Анонсированны на следующий сезон</div>
        <custom-carousel :items-per-page="6" :items="animeStore.anime.announced" />
    </q-page>
</template>

<script setup lang="ts">
import CustomCarousel from 'src/components/CustomCarousel.vue';
import { usePosterAnimeStore } from 'src/stores/poster-anime-store';

defineOptions({
    name: 'IndexPage',
    async preFetch({ store }) {
        const animeStore = usePosterAnimeStore(store);
        const popularResponse = await animeStore.api.get('anime/seasonal/popular');
        const seasonResponse = await animeStore.api.get('anime/seasonal');
        const announcedResponse = await animeStore.api.get('anime/seasonal/announced');
        animeStore.anime.popular = popularResponse.data.data;
        animeStore.anime.seasonal = seasonResponse.data.data;
        animeStore.anime.announced = announcedResponse.data.data;
    },
});

const animeStore = usePosterAnimeStore();
</script>
