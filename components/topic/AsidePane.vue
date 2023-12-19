<script setup lang="ts">
    import { useTopicUI } from '~/store/topicUI';

    const topicUI = useTopicUI();
    const props = defineProps({
        name: {
            type: String,
            required: true,
        }
    });
</script>

<template>
    <div :class="['pane', props.name, topicUI.pane === props.name ? 'current' : null]">
        <slot></slot>
    </div>
</template>

<style scoped>
    .pane
    {
        @apply absolute top-0 left-0 w-full h-full;
        @apply transition-[opacity] duration-200;

        &:not(.current)
        {
            pointer-events: none;
            touch-action: none;
            @apply opacity-0;
        }
    }
</style>