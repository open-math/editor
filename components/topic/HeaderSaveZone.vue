<script setup lang="ts">
    import { useTopic } from '~/store/topic';
    import { useTopicUI } from '~/store/topicUI';

    const topic = useTopic();
    const topicUI = useTopicUI();

    const state = computed(() => {
        if (topic.saving)
            return {
                state:  'saving',
                icon:   'ie-arrows-rotate',
                text:   'Сохранение...',
            }

        if (topic.changed)
            return {
                state:  'unsaved',
                icon:   'ie-floppy-disk',
                text:   'Сохранить',
            }

        return {
            state:  'saved',
            icon:   'ie-circle-check',
            text:   'Сохранено',
        }
    });

    function save()
    {
        if (topic.canSave)
            topic.save();
    }

    //
    // Autosave
    //

    if (process.client) // This shit leaks to other pages!
    {
        let autoSaveDelay = 60000;
        topicUI.autoSaveId = setInterval(() => save(), autoSaveDelay);
    }
</script>

<template>
    <div class="saveZone" :class="state.state" @click="save">
        <div class="statusIcon">
            <i :class="state.icon"></i>
        </div>
        <div class="statusText">{{ state.text }}</div>
    </div>
</template>

<style scoped>
    .saveZone
    {
        @apply flex gap-4 px-6 border-l border-slate-700 text-gray-500;

        > .statusIcon,
        > .statusText
        {
            @apply self-center;
        }

        > .statusIcon
        {
            @apply text-[25px];
        }

        > .statusText
        {
            @apply font-semibold;
        }

        /* States */

        &.saved { @apply text-green-700; }

        &.unsaved
        {
            @apply text-yellow-600 cursor-pointer;
            @apply transition duration-200 hover:text-yellow-400;
        }

        &.saving
        {
            > .statusIcon
            {
                @apply animate-spin;
            }
        }
    }
</style>