<template>
    <div class="fullscreen text-black text-center q-pa-md flex flex-center">
        <div>
            <div style="font-size: 30vh">404</div>

            <img src="/images/load.gif" />
            <div class="text-h4" style="opacity: 0.8">Ищу то, не знаю что</div>

            <q-btn
                class="q-mt-xl"
                color="white"
                text-color="blue"
                unelevated
                to="/"
                label="Go Home"
                no-caps />
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'ErrorNotFound',
});
</script>
