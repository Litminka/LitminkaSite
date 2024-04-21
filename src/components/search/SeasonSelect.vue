<template>
    <div class="row">
        <div class="row">
            <q-select
                filled
                v-model="startSeason"
                emit-value
                map-options
                clearable
                :options="seasons"
                label="Сезон"
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
                v-model.number="startYear"
                label="Год"
                type="number"
                filled
                clearable
                style="max-width: 200px" />
        </div>
        <div class="q-ml-sm row">
            <q-select
                filled
                v-model="endSeason"
                emit-value
                map-options
                clearable
                :options="seasons"
                label="Сезон"
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
                v-model.number="endYear"
                label="Год"
                type="number"
                filled
                clearable
                style="max-width: 200px" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Seasons } from '../models';
import { useI18n } from 'vue-i18n';

defineOptions({
    name: 'SeasonSelect',
});

const { t } = useI18n();
const model = defineModel();

const seasons = ref(
    Object.freeze(
        Object.keys(Seasons).map((season) => {
            return {
                value: season,
                label: t(`seasons.${season}`),
            };
        }),
    ),
);

const startYear = ref<number>();
const startSeason = ref<string>();
const endYear = ref<number>();
const endSeason = ref<string>();

onMounted(() => {
    const seasons = model.value as unknown as string[];
    if (seasons.length == 0) return;

    const start = seasons[0].split('_');
    if (start.length != 2) return;
    const [sSeason, sYear] = start;
    startSeason.value = sSeason;
    startYear.value = Number(sYear);

    const end = seasons[1].split('_');
    if (end.length != 2) return;
    const [eSeason, eYear] = end;
    endSeason.value = eSeason;
    endYear.value = Number(eYear);
});

const seasonPeriod = computed(() => {
    const result: string[] = [];
    if (startYear.value! > 1969 && startSeason.value) {
        result.push(`${startSeason.value}_${startYear.value}`);
    }
    if (
        result.length > 0 &&
        endYear.value! > 1969 &&
        endYear.value! >= startYear.value! &&
        endSeason.value
    ) {
        result.push(`${endSeason.value}_${endYear.value}`);
    }
    return result;
});

model.value = seasonPeriod;
</script>

<style lang="scss"></style>
