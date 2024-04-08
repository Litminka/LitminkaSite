<template>
    <div>
        <img :src="anime.image" alt="" />
        <div>{{ anime.name }}</div>
    </div>
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
