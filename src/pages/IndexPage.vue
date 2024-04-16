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
        const $store = usePosterAnimeStore(store);
        await Promise.all([$store.getAnnounced(), $store.getPopular(), $store.getSeasonal()]);
    },
});

const animeStore = usePosterAnimeStore();
</script>
