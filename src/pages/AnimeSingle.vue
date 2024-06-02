<template>
    <q-page v-if="animeStore.anime.id" class="container" padding>
        <div class="row">
            <div class="col-3">
                <q-img :src="animeStore.anime.image">
                    <div v-if="listEntry" class="absolute-top-right text-subtitle2">
                        <q-btn
                            @click="toggleFavorite"
                            flat
                            :class="{ favorite: listEntry.isFavorite }">
                            <q-icon v-if="listEntry.isFavorite" name="favorite" />
                            <q-icon v-else name="favorite_border" />
                        </q-btn>
                    </div>
                </q-img>
                <div class="row">
                    <q-rating
                        :model-value="animeStore.anime.shikimoriRating"
                        @update:model-value="updateRating"
                        :readonly="typeof listEntry === 'undefined'"
                        size="sm"
                        :max="10"
                        color="primary"
                        icon="star_border"
                        icon-selected="star"
                        icon-half="star_half" />
                    <span>
                        {{ animeStore.anime.shikimoriRating }}
                        <span v-if="listEntry?.rating">({{ listEntry.rating }})</span>
                    </span>
                </div>
                <div v-if="userStore.isAuth">
                    <div>Список</div>
                    <q-select
                        filled
                        v-model="watchListStatus"
                        emit-value
                        map-options
                        :options="watchListStatuses"
                        label="Статус"
                        style="width: 250px">
                        <template v-slot:option="{ itemProps, opt }">
                            <q-item v-bind="itemProps">
                                <q-item-section>
                                    <q-item-label>{{ opt.label }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-input
                        :min="0"
                        :max="animeStore.anime.currentEpisodes"
                        v-model="episodes"
                        type="number" />
                    <q-btn @click="saveList">Сохранить</q-btn>
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
                                <router-link
                                    :to="{
                                        path: '/anime/search',
                                        query: { includeGenres: genre.id },
                                    }">
                                    {{ genre.nameRussian }}
                                </router-link>
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
        <kodik-player
            v-if="animeStore.anime.animeTranslations.length > 0"
            :anime="animeStore.anime"></kodik-player>
        <div v-else>Пока нет возможности смотреть</div>
    </q-page>
    <div v-else>Loading</div>
</template>

<script setup lang="ts">
import { defineOptions, ref } from 'vue';
import { useAnimeStore } from 'src/stores/anime-store';
import KodikPlayer from 'src/components/kodik/KodikPlayer.vue';
import { useUserStore } from 'src/stores/user-store';
import { useI18n } from 'vue-i18n';
import { AnimeListStatuses, WatchList } from 'src/components/models';
import { useQuasar } from 'quasar';

const { t } = useI18n();
const $q = useQuasar();

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
const userStore = useUserStore();

const watchListStatuses = ref(
    Object.freeze(
        Object.keys(AnimeListStatuses).map((rating) => {
            return {
                value: rating.toLowerCase(),
                label: t(`animeListStatuses.${rating}`),
            };
        }),
    ),
);

let listEntry = ref<WatchList | undefined>(undefined);

if (animeStore.anime.animeLists && animeStore.anime.animeLists.length > 0) {
    listEntry.value = animeStore.anime.animeLists[0];
}

const watchListStatus = ref(listEntry.value?.status ?? '');
const episodes = ref(listEntry.value?.watchedEpisodes ?? 0);

async function saveList() {
    const body = {
        watchedEpisodes: episodes.value,
        status: watchListStatus.value,
        rating: 0,
        isFavorite: false,
    };

    if (listEntry.value) {
        userStore.api.patch(`/watch-list/${animeStore.anime.id}`, body);
        return;
    }

    const response = await userStore.api.post(`/watch-list/${animeStore.anime.id}`, body);

    listEntry.value = response.data.body as WatchList;
    $q.notify({
        color: 'info',
        position: 'bottom-right',
        message: 'Аниме добавлено в список',
        timeout: 1500,
    });
}

async function updateRating(value: number) {
    if (!listEntry.value) return;

    const body = {
        watchedEpisodes: listEntry.value.watchedEpisodes,
        status: listEntry.value.status,
        rating: value,
        isFavorite: listEntry.value.isFavorite,
    };

    const response = await userStore.api.patch(`/watch-list/${animeStore.anime.id}`, body);
    listEntry.value = response.data.body as WatchList;
    $q.notify({
        color: 'info',
        position: 'bottom-right',
        message: `Вы оценили аниме на: ${value}`,
        timeout: 1500,
    });
}

async function toggleFavorite() {
    if (!listEntry.value) return;

    const body = {
        watchedEpisodes: listEntry.value.watchedEpisodes,
        status: listEntry.value.status,
        rating: listEntry.value.rating,
        isFavorite: !listEntry.value.isFavorite,
    };

    const response = await userStore.api.patch(`/watch-list/${animeStore.anime.id}`, body);
    listEntry.value = response.data.body as WatchList;
    $q.notify({
        color: 'info',
        position: 'bottom-right',
        message: 'Фаворит изменен',
        timeout: 1500,
    });
}
</script>

<style lang="scss">
.container {
    width: 70%;
    margin: 0 auto;
}

.favorite {
    color: red;
}
</style>
