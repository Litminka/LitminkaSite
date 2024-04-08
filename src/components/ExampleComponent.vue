<template>
    <div>
        <p>{{ title }}</p>
        <ul>
            <li v-for="todo in todos" :key="todo.id" @click="increment">
                {{ todo.id }} - {{ todo.content }}
            </li>
        </ul>
        <p>Count: {{ todoCount }} / {{ meta.totalCount }}</p>
        <p>Active: {{ active ? 'yes' : 'no' }}</p>
        <p>Clicks on todos: {{ store.counter }}</p>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Todo, Meta } from './models';
import { useCounterStore } from 'src/stores/example-store';

const store = useCounterStore();

interface Props {
    title: string;
    todos?: Todo[];
    meta: Meta;
    active: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    todos: () => [],
});

function increment() {
    store.counter += 1;
}

const todoCount = computed(() => props.todos.length);
</script>
