<template>
    <q-page padding>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-input v-model="search.name" label="Название *" hint="Название аниме" />

            <div class="row">
                <q-select
                    filled
                    v-model="search.includeGenres"
                    multiple
                    emit-value
                    map-options
                    clearable
                    :options="genres"
                    label="Жанры"
                    style="width: 250px">
                    <template v-slot:option="{ itemProps, opt }">
                        <q-item v-bind="itemProps">
                            <q-item-section>
                                <q-item-label>{{ opt.label }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>

                <q-select
                    filled
                    v-model="search.excludeGenres"
                    multiple
                    emit-value
                    map-options
                    clearable
                    :options="genres"
                    label="Исключить жанры"
                    style="width: 250px">
                    <template v-slot:option="{ itemProps, opt }">
                        <q-item v-bind="itemProps">
                            <q-item-section>
                                <q-item-label>{{ opt.label }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>
            </div>

            <div class="row">
                <season-select v-model="search.seasons"></season-select>
            </div>
            <div class="row">
                <period-select v-model="search.period"></period-select>
            </div>
            <q-select
                filled
                v-model="search.rpaRatings"
                multiple
                emit-value
                map-options
                clearable
                :options="rpaRatings"
                label="Возрастное ограничение"
                style="width: 250px">
                <template v-slot:option="{ itemProps, opt }">
                    <q-item v-bind="itemProps">
                        <q-item-section>
                            <q-item-label>{{ opt.label }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </template>
            </q-select>
            <q-select
                filled
                v-model="search.mediaTypes"
                multiple
                emit-value
                map-options
                clearable
                :options="mediaTypes"
                label="Тип"
                style="width: 250px">
                <template v-slot:option="{ itemProps, opt }">
                    <q-item v-bind="itemProps">
                        <q-item-section>
                            <q-item-label>{{ opt.label }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </template>
            </q-select>
            <q-select
                filled
                v-model="search.statuses"
                multiple
                emit-value
                map-options
                clearable
                :options="statuses"
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

            <div>
                <q-btn label="Submit" type="submit" color="primary" />
                <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
        </q-form>

        <div class="grid">
            <anime-poster v-for="(anime, i) in $store.anime.search" :anime="anime" :key="i" />
        </div>
    </q-page>
</template>

<script setup lang="ts">
import {
    AnimeMediaTypes,
    AnimePgaRatings,
    AnimeStatuses,
    SearchQuery,
} from 'src/components/models';
import AnimePoster from 'src/components/anime/AnimePoster.vue';
import SeasonSelect from 'src/components/search/SeasonSelect.vue';
import PeriodSelect from 'src/components/search/PeriodSelect.vue';
import { usePosterAnimeStore } from 'src/stores/poster-anime-store';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGenreStore } from 'src/stores/genre-store';
import { useI18n } from 'vue-i18n';

defineOptions({
    name: 'SearchName',
    async preFetch({ currentRoute, store }) {
        const $store = usePosterAnimeStore(store);
        const $genreStore = useGenreStore(store);
        const query = currentRoute.query as unknown as SearchQuery;
        await $store.search(query);
        await $genreStore.getGenres();
    },
});

const router = useRouter();
const { t } = useI18n();
const $store = usePosterAnimeStore();
const $genreStore = useGenreStore();

const qr = router.currentRoute.value.query as unknown as SearchQuery;

const search = ref<SearchQuery>({
    name: qr.name ?? '',
    excludeGenres: $store.toArray(qr.excludeGenres) ?? [],
    includeGenres: $store.toArray(qr.includeGenres) ?? [],
    mediaTypes: qr.mediaTypes ?? [],
    pageLimit: qr.pageLimit ?? 100,
    page: qr.page ?? 1,
    period: qr.period ?? [],
    rpaRatings: qr.rpaRatings ?? [],
    seasons: qr.seasons ?? [],
    statuses: qr.statuses ?? [],
});

const genres = ref(
    Object.freeze(
        $genreStore.genres.map((genre) => {
            return {
                value: Number(genre.id),
                label: genre.nameRussian,
            };
        }),
    ),
);

const rpaRatings = ref(
    Object.freeze(
        Object.keys(AnimePgaRatings).map((rating) => {
            return {
                value: rating.toLowerCase(),
                label: t(`animeRatings.${rating}`),
            };
        }),
    ),
);
const mediaTypes = ref(
    Object.freeze(
        Object.keys(AnimeMediaTypes).map((media) => {
            return {
                value: media.toLowerCase(),
                label: t(`mediaTypes.${media}`),
            };
        }),
    ),
);
const statuses = ref(
    Object.freeze(
        Object.keys(AnimeStatuses).map((status) => {
            return {
                value: status.toLowerCase(),
                label: t(`statuses.${status}`),
            };
        }),
    ),
);

async function onSubmit() {
    $store.anime.search = [];
    const data = search.value;
    await $store.router.replace({
        query: {
            name: reset(data.name),
            excludeGenres: reset(data.excludeGenres),
            includeGenres: reset(data.includeGenres),
            mediaTypes: reset(data.mediaTypes),
            pageLimit: 100,
            page: 1,
            rpaRatings: reset(data.rpaRatings),
            seasons: reset(data.seasons),
            statuses: reset(data.statuses),
            period: reset(data.period),
        },
    });
    const query = $store.router.currentRoute.value.query as unknown as SearchQuery;
    $store.search(query);
}

function onReset() {}

function reset(arg?: string[] | string | number[]) {
    if (arg === null) return undefined;
    if (arg === undefined) return undefined;
    if (typeof arg === 'string' || typeof arg === 'number') return arg;
    if (arg.length > 0) return arg;
    return undefined;
}
</script>
