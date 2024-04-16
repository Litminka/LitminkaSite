<template>
    <q-page padding>
        <div class="grid">
            <anime-poster v-for="(anime, i) in store.anime.top100" :anime="anime" :key="i" />
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { usePosterAnimeStore } from 'src/stores/poster-anime-store';
import AnimePoster from 'src/components/anime/AnimePoster.vue';
defineOptions({
    name: 'top-100',
    async preFetch({ store }) {
        const $store = usePosterAnimeStore(store);
        await $store.getTop100();
    },
});
const store = usePosterAnimeStore();
</script>

<style lang="scss">
.grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}
</style>
