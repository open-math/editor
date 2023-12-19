<script setup lang="ts">
    import { useTopicUI } from '~/store/topicUI';

    const topicUI = useTopicUI();
</script>

<template>
    <aside :class="{ panes: 1, opened: !!topicUI.pane }">
        <slot></slot>
    </aside>
</template>

<style>
    aside.panes
    {
        @apply absolute z-20 top-0 h-full w-[var(--asidePane)] border-r border-slate-700 bg-slate-800;
        @apply transition-[left] duration-200;

        &:not(.opened)
        {
            left: calc(var(--asideMenu) - var(--asidePane));
        }

        &.opened
        {
            @apply left-[var(--asideMenu)];
        }
    }
</style>