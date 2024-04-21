<template>
    <div class="row">
        <q-input label="От" filled v-model="startDate" mask="date">
            <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="startDate">
                            <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                        </q-date>
                    </q-popup-proxy>
                </q-icon>
            </template>
        </q-input>
        <q-input label="До" filled v-model="endDate" mask="date">
            <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="endDate">
                            <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                        </q-date>
                    </q-popup-proxy>
                </q-icon>
            </template>
        </q-input>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

defineOptions({
    name: 'PeriodSelect',
});

const model = defineModel();

const startDate = ref<string>();
const endDate = ref<string>();

onMounted(() => {
    const dates = model.value as unknown as string[];
    startDate.value = dates[0] ?? '';
    endDate.value = dates[1] ?? '';
});

const period = computed(() => {
    if (startDate.value && endDate.value) {
        return [startDate.value.toString(), endDate.value.toString()];
    }
    if (startDate.value) {
        return [startDate.value.toString(), null];
    }
    if (endDate.value) {
        return [null, endDate.value!.toString()];
    }
    return [];
});

model.value = period;
</script>

<style lang="scss"></style>
