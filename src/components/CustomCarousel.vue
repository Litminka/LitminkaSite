<template>
    <q-carousel
        v-model="slide"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        infinite
        :autoplay="autoplay"
        control-color="amber"
        :navigation="items.length > itemsPerPage"
        :arrows="items.length > itemsPerPage"
        padding
        height="500px"
        @mouseenter="autoplay = false"
        @mouseleave="autoplay = true"
        class="full-width">
        <q-carousel-slide
            v-for="(items, i) in carouselItems"
            :key="i"
            :name="i + 1"
            class="row justify-between fit items-center q-gutter-xs q-col-gutter no-wrap">
            <anime-poster v-for="(item, j) in items" :key="j" :anime="item"></anime-poster>
        </q-carousel-slide>
    </q-carousel>
</template>

<script setup lang="ts">
import { PropType, computed, ref } from 'vue';
import AnimePoster from 'src/components/anime/AnimePoster.vue';
import { PosterAnime } from './models';

defineOptions({
    name: 'CustomCarousel',
});

const props = defineProps({
    itemsPerPage: {
        type: Number,
        required: true,
    },
    items: {
        type: Array as PropType<PosterAnime[]>,
        required: true,
    },
});

const slide = ref(1);
const autoplay = ref(true);

const carouselItems = computed(() => {
    const chunkSize = props.itemsPerPage;
    const items = [];
    for (let i = 0; i < props.items.length; i += chunkSize) {
        const res = props.items.slice(i, i + chunkSize);
        if (res.length < chunkSize) {
            const starting = props.items.slice(0, chunkSize - res.length);
            res.push(...starting);
        }
        items.push(res);
    }
    return items;
});
</script>
