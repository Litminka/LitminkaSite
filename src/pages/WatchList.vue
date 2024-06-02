<template>
    <q-page padding>
        <div class="q-pa-md">
            <q-table
                flat
                style="height: max-content"
                class="table"
                title="Список"
                :rows="watchListStore.watchList"
                :columns="columns"
                row-key="name"
                virtual-scroll
                hide-bottom
                v-model:pagination="pagination"
                :rows-per-page-options="[0]">
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="index" :props="props">
                            {{ props.row.anime.id }}
                        </q-td>
                        <q-td key="name" :props="props">
                            <router-link :to="{ path: `/anime/${props.row.anime.slug}` }">
                                {{ props.row.anime.name }}
                            </router-link>
                        </q-td>
                        <q-td key="status" :props="props">
                            {{ t(`animeListStatuses.${props.row.status}`) }}
                        </q-td>
                        <q-td key="rating" :props="props">
                            {{ props.row.rating }}
                        </q-td>
                        <q-td key="episodes" :props="props">
                            <span>{{ props.row.watchedEpisodes }}</span>
                            <span>/</span>
                            <span v-if="props.row.anime.maxEpisodes">
                                {{ props.row.anime.maxEpisodes }}
                            </span>
                            <span v-else>?</span>
                        </q-td>
                        <q-td key="type" :props="props">
                            {{ t(`mediaTypes.${props.row.anime.mediaType}`) }}
                        </q-td>
                        <q-td key="favorite" :props="props">
                            <q-checkbox v-model="props.row.isFavorite" disable color="teal" />
                        </q-td>
                        <q-td key="favorite" :props="props">
                            <q-btn @click="deleteItem(props.row.anime.id)" color="red">X</q-btn>
                        </q-td>
                    </q-tr>
                </template>
            </q-table>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { QTableColumn } from 'quasar';
import { useWatchListStore } from 'src/stores/watch-list-store';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineOptions({
    name: 'WatchList',
    async preFetch({ store }) {
        const $store = useWatchListStore(store);
        await $store.getWatchList();
    },
});
const pagination = ref({ rowsPerPage: 0 });
const columns: QTableColumn[] = [
    { name: 'index', label: '#', field: 'index' },
    { name: 'name', label: 'Название', field: 'name', align: 'left' },
    { name: 'status', label: 'Статус', field: 'status' },
    { name: 'rating', label: 'Оценка', field: 'rating' },
    { name: 'episodes', label: 'Эпизоды', field: 'episodes' },
    { name: 'type', label: 'Тип', field: 'type' },
    { name: 'favorite', label: 'В избранном', field: 'favorite' },
    { name: 'actions', label: 'Действия', field: 'actions' },
];

const watchListStore = useWatchListStore();

onMounted(() => {
    console.log(watchListStore.watchList);
});
function deleteItem(id: number) {
    watchListStore.api.delete(`/watch-list/${id}`);
    watchListStore.watchList = watchListStore.watchList.filter((list) => list.animeId !== id);
}
</script>

<style scoped lang="scss"></style>
