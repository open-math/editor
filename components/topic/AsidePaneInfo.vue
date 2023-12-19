<script setup lang="ts">
    import { useTopic } from '~/store/topic';

    const topic = useTopic();
</script>

<template>
    <TopicAsidePane name="info">
        <input class="itext" type="text" placeholder="Название темы" v-model="topic.title" :disabled="!topic.canEdit">
        <textarea v-model="topic.desc" :disabled="!topic.canEdit"  placeholder="Описание темы" class="itext"></textarea>
        <textarea v-model="topic.tags" :disabled="!topic.canEdit" placeholder="Теги" class="itext"></textarea>
        <textarea v-model="topic.contributors" :disabled="!topic.canEdit" placeholder="Авторы" class="itext"></textarea>
        <textarea v-model="topic.macros" :disabled="!topic.canEdit" placeholder="Макрос" class="itext"></textarea>
        
        <div class="flex items-center ps-4 border border-slate-700 rounded">
            <input v-model="topic.privateMode" :disabled="!topic.canEdit" id="private-check" type="checkbox" class="w-4 h-4 text-blue-600 focus:ring-blue-600 ring-offset-slate-900 focus:ring-2 bg-slate-900 border-slate-700">
            <label for="private-check" class="w-full py-4 ms-2 text-sm font-medium text-gray-300">Приватная тема?</label>
        </div>
    </TopicAsidePane>
</template>

<style scoped lang="scss">
    .pane.info
    {
        @apply flex flex-col gap-4 p-4;
    }

    .itext
    {
        @apply w-full p-2 px-3 bg-slate-900 border border-slate-700 rounded-lg text-sm text-gray-300;

        &[disabled]
        {
            @apply bg-slate-700;
        }
    }
</style>