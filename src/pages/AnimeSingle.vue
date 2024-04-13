<template>
    <q-page class="container" padding>
        <div class="row">
            <div class="col-3">
                <q-img :src="animeStore.anime.image">
                    <div class="absolute-bottom text-h1 text-subtitle1 text-center">
                        кто прочитал тот здохнет🐺
                    </div>
                </q-img>
                <div class="row">
                    <q-rating
                        v-model="animeStore.anime.shikimoriRating"
                        size="sm"
                        :max="10"
                        color="primary"
                        readonly
                        icon="star_border"
                        icon-selected="star"
                        icon-half="star_half" />
                    {{ animeStore.anime.shikimoriRating }}
                </div>
            </div>
            <div class="col-9 q-pa-sm">
                <div class="text-h2">{{ animeStore.anime.name }}</div>
                <q-separator class="q-my-md" inset />
                <div class="col-12">
                    <div class="row">
                        <div class="col-3">Альтернативные названия</div>
                        <div class="col-9">
                            {{ animeStore.anime.englishName }},
                            {{ animeStore.anime.japaneseName }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-3">Жанры</div>
                        <div class="col-9">
                            <q-badge
                                v-for="genre in animeStore.anime.genres"
                                :key="genre.id"
                                color="blue">
                                {{ genre.name }}
                            </q-badge>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-3">Тип</div>
                        <div class="row">{{ animeStore.anime.mediaType }}</div>
                    </div>
                    <div class="row">
                        <div class="col-3">Количество серий</div>
                        <div class="col-9">
                            <div class="row">
                                {{ animeStore.anime.currentEpisodes }}/{{
                                    animeStore.anime.maxEpisodes === 0
                                        ? '?'
                                        : animeStore.anime.maxEpisodes
                                }}
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-3">Состояние</div>
                        <div class="col-9">
                            {{ animeStore.anime.status }}
                        </div>
                    </div>
                    <q-separator class="q-my-md" inset />
                    <div class="row">
                        <div>
                            <div class="text-h5">Описание</div>
                            {{ escapeText(animeStore.anime.description) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <kodik-player :anime="animeStore.anime"></kodik-player>
    </q-page>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue';
import { useAnimeStore } from 'src/stores/AnimeStore';
import KodikPlayer from 'src/components/kodik/KodikPlayer.vue';

defineOptions({
    name: 'AnimeSingle',
    async preFetch({ store, currentRoute }) {
        const animeStore = useAnimeStore(store);

        const response = await animeStore.api.get(`/anime/${currentRoute.params.slug}`);

        animeStore.anime = response.data.body;
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
