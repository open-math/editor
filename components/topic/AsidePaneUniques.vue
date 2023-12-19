<script setup lang="ts">
    import type { UniqueListItem } from '~/assets/translator/unique';
    import { useTopic } from '~/store/topic';
import { useTopicUI } from '~/store/topicUI';

    const topic = useTopic();
    const topicUI = useTopicUI();

    function getGroupName(group)
    {
        switch(group)
        {
            case 'article': return      'Статья';
            case 'summary': return      'Конспект';
            case 'practicum': return    'Практикум';
        }
    }

    function uniqueClick(unique: UniqueListItem)
    {
        let copyText = unique.type + ':' + unique.id;

        if (topicUI.tab !== unique.topicPart)
            copyText = unique.topicPart + '|' + copyText;

        navigator.clipboard.writeText(copyText);
    }
</script>

<template>
    <TopicAsidePane name="uniques">
        <TopicAsideScroller class="scroll">
            <template v-if="topic.uniques">
                <template v-for="(uniques, group) in topic.uniques">
                    <div class="bg-slate-700 text-gray-400 font-semibold p-3">{{ getGroupName(group) }}</div>
                    <div>
                        <div class="unique" v-for="unique in uniques" @click="uniqueClick(unique)">
                            <div class="type">{{ unique.type }}</div>
                            <div class="id">{{  unique.id }}</div>
                            <div class="title" v-if="unique.title">{{ unique.title }}</div>
                        </div>
                    </div>
                </template>
            </template>
            <div v-else class="text-gray-500 text-center mt-3">Уникальных блоков нет!</div>
        </TopicAsideScroller>
    </TopicAsidePane>
</template>

<style scoped lang="scss">
    .scroll
    {
        height: 100dvh;
    }

    .unique
    {
        @apply p-3 border-b border-slate-700 cursor-pointer;

        &:hover .id { @apply text-gray-200; }

        .type, .title
        {
            @apply text-gray-500 text-sm;
        }

        .id
        {
            @apply text-gray-400 font-semibold;
            @apply transition duration-200;
            position: relative;
            top: -1.5px;
        }
    }
</style>