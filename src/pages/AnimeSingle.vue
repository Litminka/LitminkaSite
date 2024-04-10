<template>
    <q-page class="container" padding>
        <div class="row">
            <div class="col-2">
                <q-img :src="animeStore.anime.image">
                    <div
                        class="absolute-bottom text-h1 text-subtitle1 text-center"
                    >
                        кто прочитал тот здохнет🐺
                    </div>
                </q-img>
            </div>
            <div class="col-8">
                <div class="text-h2">{{ animeStore.anime.name }}</div>
                <div class="row">
                    <q-badge
                        v-for="genre in animeStore.anime.genres"
                        :key="genre.id"
                        color="blue"
                    >
                        {{ genre.name }}</q-badge
                    >
                </div>
                <div>{{ escapeText(animeStore.anime.description) }}</div>
            </div>
        </div>
        <kodik-player :anime="animeStore.anime"></kodik-player>
    </q-page>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue';
import { useAnimeStore } from 'src/stores/AnimeStore';
import { AxiosError } from 'axios';
import KodikPlayer from 'src/components/kodik/KodikPlayer.vue';

defineOptions({
    name: 'AnimeSingle',
    async preFetch({ store, currentRoute, redirect }) {
        const animeStore = useAnimeStore(store);
        try {
            const response = await animeStore.api.get(
                `/anime/${currentRoute.params.slug}`,
            );
            animeStore.anime = response.data.body;
        } catch (error) {
            const err = error as AxiosError;
            if (err.response?.status === 404) {
                //TODO: Rewrite to interceptor
                redirect('/404');
            }
        }
    },
});

function escapeText(text: string) {
    if (!text) return '';
    text = text.replace(/\s+/g, ' ').trim();
    return text.replaceAll(/\[.+\]/g, '');
}

const animeStore = useAnimeStore();
console.log(animeStore.anime);
</script>

<style lang="scss">
.container {
    width: 70%;
    margin: 0 auto;
}
</style>
