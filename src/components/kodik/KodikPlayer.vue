<template>
    <div class="q-video">
        <iframe :src="link" frameborder="0" allowfullscreen />
    </div>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue';
defineOptions({
    name: 'KodikPlayer',
});
defineProps({
    link: {
        type: String,
        required: true,
    },
});
</script>

<style lang="scss">
.q-video {
    aspect-ratio: 16/9;
    width: 50%;
    margin: 0 auto;
}
</style>
