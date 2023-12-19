<script setup lang="ts">
    import { useTopic } from '~/store/topic';
import { useUser } from '~/store/user';

    const topic = useTopic();
    
    const user = useUser();
    await user.fetchUser();

    async function removeTopic()
    {
        if (!confirm('Удалить тему?'))
            return;

        await $fetch(`/api/topic/${topic.topicId}/delete`, {
            method: 'post',
            headers: useRequestHeaders(['cookie']),
        });

        navigateTo('/');
    }

    async function cloneTopic()
    {
        const clonedTopicId = await $fetch(`/api/topic/${topic.topicId}/clone`, {
            method: 'post',
            headers: useRequestHeaders(['cookie']),
        });

        if (clonedTopicId)
            navigateTo('/topic/' + clonedTopicId);
    }

    async function downloadTopic()
    {
        const zipBlob = await $fetch(`/api/topic/${topic.topicId}/download`, {
            method: 'post',
            headers: useRequestHeaders(['cookie']),
        });

        if (!zipBlob)
            return;

        let link = document.createElement('a');
            link.setAttribute('download', topic.title);
            link.href = URL.createObjectURL(zipBlob);
            document.body.appendChild(link);
            link.click();
            link.remove();
    }
</script>

<template>
    <TopicAsidePane name="main">
        <TopicAsideScroller class="scroll">
            <button @click="downloadTopic">
                <i class="ie-file-zipper"></i>
                <span>Скачать тему</span>
            </button>

            <button v-if="user.canCreateTopic" @click="cloneTopic">
                <i class="ie-clone"></i>
                <span>Создать дубликат</span>
            </button>

            <NuxtLink to="/">
                <i class="ie-door-open"></i>
                <span>Закрыть редактор</span>
            </NuxtLink>

            <button v-if="topic.canEdit" @click="removeTopic" class="remove">
                <i class="ie-trash-can"></i>
                <span>Удалить тему</span>
            </button>
        </TopicAsideScroller>
    </TopicAsidePane>
</template>

<style scoped lang="scss">
    .scroll
    {
        @apply flex flex-col h-[100dvh];
    }

    .scroll > *
    {
        @apply flex items-center p-4 gap-3 border-b border-slate-700 text-gray-400;
        @apply transition-[color] duration-200 hover:text-gray-300;

        > i
        {
            @apply min-w-[25px] text-[18px];
        }

        &.remove:hover
        {
            @apply text-red-700;
        }
    }
</style>