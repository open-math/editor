<script setup lang="ts">
    import { switchTheme } from '~/assets/iframe';

    import { useTopic } from '~/store/topic';
    import { useTopicPreview } from '~/store/topicPreview';
    import { useTopicUI, Tab } from '~/store/topicUI';

    const topicUI = useTopicUI();
    const topic = useTopic();
    const topicPreview = useTopicPreview();
</script>

<template>
    <header>
        <div class="main">
            <div class="tabs">
                <button v-for="tab in Tab" @click="topicUI.tab = tab" :class="{ current: tab === topicUI.tab }"><i :class="`ie-topic-${tab}`"></i></button>
            </div>
            <TopicHeaderSaveZone v-if="topic.canEdit" />
        </div>
        
        <div class="previewControls">
            <button @click="switchTheme" title="Сменить тему"><i class="ie-sun-and-moon"></i></button>
            <button title="Вид по умолчанию" @click="topicPreview.fullWidth"><i class="ie-display"></i></button>
            <button title="Вид: планшет" @click="topicPreview.tabletWidth"><i class="ie-tablet"></i></button>
            <button title="Вид: смартфон" @click="topicPreview.mobileWidth"><i class="ie-mobile"></i></button>
        </div>
    </header>
</template>

<style lang="scss" scoped>
    header
    {
        @apply h-[var(--headerHeight)] border-b border-slate-700 bg-slate-800;
        @apply flex justify-between items-stretch px-3;

        > .main
        {
            @apply flex gap-3;

            > .tabs
            {
                @apply flex gap-3;

                > button
                {
                    @apply relative h-full;
                    @apply text-gray-500 text-[25px] px-4;
                    @apply transition duration-200 hover:text-gray-300;

                    &::after
                    {
                        content: "";
                        @apply absolute left-0 bottom-[-1px] w-full h-[2px] bg-slate-600;
                        @apply transition duration-200 opacity-0 hover:opacity-100;
                    }

                    &.current
                    {
                        @apply text-gray-300;
                        &::after { @apply opacity-100 bg-slate-400; }
                    }
                }
            }
        }

        > .previewControls
        {
            @apply self-center;

            > button
            {
                @apply text-gray-500 text-[22px] px-4;
                @apply transition duration-200 hover:text-gray-300;
            }
        }
    }
</style>

<style>
    :root
    {
        --headerHeight: 50px;
    }
</style>