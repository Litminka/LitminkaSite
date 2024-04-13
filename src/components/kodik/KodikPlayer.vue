<template>
    <div class="q-video">
        <div class="row">
            <div class="col-3">
                <q-select
                    v-model="currentTranslation"
                    :options="options"
                    options-dense
                    label="Озвучка" />
            </div>
        </div>
        <div class="row grid-container">
            <div v-for="i in [...Array(currentTranslation.value.currentEpisodes).keys()]" :key="i">
                <q-btn
                    size="sm"
                    :color="currentEpisode === i + 1 ? 'secondary' : 'primary'"
                    :disable="currentEpisode === i + 1"
                    @click="changeEpisode(i + 1)">
                    {{ i + 1 }}
                </q-btn>
            </div>
        </div>

        <iframe class="fit size" ref="kodik" :src="kodikLink" frameborder="0" allowfullscreen />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, defineOptions, PropType } from 'vue';
import { Anime } from '../models';
import { onMounted } from 'vue';
import { onUnmounted } from 'vue';

defineOptions({
    name: 'KodikPlayer',
});

const kodik = ref();
const props = defineProps({
    anime: {
        type: Object as PropType<Anime>,
        required: true,
    },
});

const kodikLink = computed(() => {
    return `${currentTranslation.value.value.link}?hide_selectors=true&episode=${currentEpisode.value}`;
});

const translations = computed(() => {
    return props.anime.animeTranslations.map((translation) => {
        return {
            label: translation.group.name,
            value: translation,
            description: translation.group.type,
        };
    });
});

const currentTranslation = ref({
    label: props.anime.animeTranslations[0].group.name,
    value: props.anime.animeTranslations[0],
    description: props.anime.animeTranslations[0].group.type,
});
const options = translations;

const currentEpisode = ref(1);
function changeEpisode(episode: number) {
    currentEpisode.value = episode;
}

function kodikListener(message: MessageEvent) {
    if (!message) return;
    if (typeof message.data.key === 'undefined') return;
    if (message.data.key.includes('kodik')) {
        // todo: fix continue button
        if (message.data.key === 'kodik_player_current_episode') {
            changeEpisode(message.data.value.episode);
        }
    }
}

onMounted(() => {
    window.addEventListener('message', kodikListener);
});

onUnmounted(() => {
    window.removeEventListener('message', kodikListener);
});
</script>

<style lang="scss">
.q-video {
    width: 75%;
    margin: 0 auto;
}
.size {
    aspect-ratio: 16/9;
}

.grid-container {
    max-height: 400px;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(16, 1fr);
}
</style>
