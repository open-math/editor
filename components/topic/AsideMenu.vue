<script setup lang="ts">
    import { useTopicUI } from '~/store/topicUI';

    const topicUI = useTopicUI();
    
    //

    interface IAsideButton {
        name: string;
        icon: string;
    }

    const buttons: IAsideButton[] = [
        { name: 'main',     icon: 'ie-omath' },
        { name: 'info',     icon: 'ie-circle-info' },
        { name: 'assets',   icon: 'ie-shapes' },
        { name: 'uniques',  icon: 'ie-hashtag' },
    ];

    function togglePane(name: string) {
        topicUI.pane = (name === topicUI.pane) ? null : name;
    }
</script>

<template>
    <aside class="menu">
        <button v-for="button in buttons" @click="togglePane(button.name)" :class="['asideButton', button.name, topicUI.pane === button.name ? 'current' : null]">
            <i :class="button.icon"></i>
        </button>
    </aside>
</template>

<style>
    aside.menu
    {
        @apply absolute z-30 top-0 left-0 h-full w-[var(--asideMenu)] border-r border-slate-700 bg-slate-800;
    }

    .asideButton
    {
        @apply relative w-full aspect-square;
        @apply flex justify-center items-center text-gray-500 text-[21px];
        @apply transition duration-200 hover:text-gray-300;

        &::after
        {
            content: "";
            @apply absolute right-[-1px] h-4/5 w-[2px] bg-slate-600;
            @apply transition duration-200 opacity-0 hover:opacity-100;
        }

        &.current
        {
            @apply text-gray-300;
            &::after { @apply opacity-100 bg-slate-400; }
        }

        &.main
        {
            @apply hover:text-sky-500 text-[24px];
            &.current { @apply text-sky-500; }
        }
    }
</style>