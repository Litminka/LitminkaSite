<template>
    <q-img :src="anime.image" style="height: 100%" :ratio="9 / 16" width="400px" fit="cover">
        <div class="absolute-bottom text-subtitle1 text-center">
            <router-link class="link" :to="{ path: `/anime/${anime.slug}` }">
                {{ anime.name }}
            </router-link>
        </div>
    </q-img>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { PosterAnime } from '../models';

defineProps({
    anime: {
        type: Object as PropType<PosterAnime>,
        required: true,
    },
});
</script>

<style lang="scss">
.link {
    color: white;
    text-decoration: none;
}

.link:hover {
    color: $warning;
}
</style>
