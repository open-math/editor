<script setup lang="ts">
    import { useAuthStore } from '~/store/auth';
import { useUser } from '~/store/user';

    definePageMeta({
        middleware: 'logged'
    });

    const config = useRuntimeConfig();

    const user = useUser();
    await user.fetchUser();

    useHead({
        title: user.login
    });

    //
    // Help topics
    //

    const { data: helpTopics } = await useFetch('/api/topic/help', {
        headers: useRequestHeaders(['cookie'])
    });

    //
    //
    //

    const topicCounterContent = computed(() =>
    {
        const topicsNum = user.topics.length;
        const maxNum = config.public.maxTopics;

        return `${ topicsNum }${ !user.isEditor ? ' из ' + maxNum : '' }`;
    });

    //
    //
    //

    async function addTopic()
    {
        const topicId = await $fetch('/api/topic/create', {
            headers: useRequestHeaders(['cookie'])
        });

        if (!topicId)
            throw createError('Ошибка при создании новой темы!');

        navigateTo('/topic/' + topicId);
    }

    async function addTopicByUrl()
    {
        let url = prompt('Ссылка на статью в учебнике:');

        if (!url)
            return;

        try { url = new URL(url).pathname; }
        catch { return; }

        url = url.replace(/^\/(article|summary|practicum)\//gm, '');

        const topicId = await $fetch('/api/topic/createFromUrl', {
            method: 'post',
            headers: useRequestHeaders(['cookie']),
            body: { url },
        });

        console.log(topicId);
    }

    async function logout()
    {
        await useAuthStore().logout();
        navigateTo('/auth');
    }

    //
    //
    //

    function getNiceTime(timestamp: string)
    {
        const date = new Date(timestamp);
        return date.toLocaleString(undefined, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });
    }
</script>

<template>
    <div class="bg-slate-100 min-h-screen h-full flex justify-center items-center">
        <div class="min-h-screen h-full w-full bg-white flex flex-col justify-center overflow-hidden sm:max-w-2xl sm:min-h-full sm:shadow-lg sm:rounded-lg">
            <header class="flex justify-between items-center p-5">
                <div>
                    <h1 class="font-semibold text-xl">{{ user.login }}</h1>
                    <div class="text-gray-600 text-lg">{{ user.isEditor ? 'Редактор' : 'Участник' }}</div>
                </div>

                <div class="flex gap-5">
                    <button @click="logout" title="Выйти" class="actionButton hover:text-red-600 hover:border-red-400">
                        <i class="ie-door-open"></i>
                    </button>
                    
                    <button @click="addTopic" :title="user.canCreateTopic ? 'Новая тема' : 'Достигнут максимум тем!'" class="actionButton addTopic" :disabled="!user.canCreateTopic">
                        <i class="ie-file-circle-plus"></i>
                    </button>

                    <button @click="addTopicByUrl" :title="user.canCreateTopic ? 'Новая тема по ссылке' : 'Достигнут максимум тем!'" class="actionButton addTopic" :disabled="!user.canCreateTopic">
                        <i class="ie-file-import"></i>
                    </button>
                </div>
            </header>

            <div v-if="user.topics.length > 0">
                <div class="bg-gray-100 border-b border-t text-gray-500 p-2 px-5">Темы: <span class="font-semibold" :class="!user.canCreateTopic ? 'text-red-600' : ''">{{ topicCounterContent }}</span></div>
                <div class="topics">
                    <NuxtLink v-for="topic in user.topics" :to="`/topic/${topic.id}`" class="topic">
                        <div class="flex flex-col gap-0">
                            <span>{{ topic.title }}</span>
                            <span class="text-sm text-gray-500">{{ getNiceTime(topic.lastEdit) }}</span>
                        </div>
                        
                        <i class="ie-arrow-right"></i>
                    </NuxtLink>
                </div>
            </div>

            <div v-if="helpTopics && helpTopics.length > 0">
                <div class="bg-gray-100 border-b border-t text-gray-500 p-2 px-5">Полезные темы</div>
                <div class="topics">
                    <NuxtLink v-for="helpTopic in helpTopics" :to="`/topic/${helpTopic.id}`" class="topic">
                        <span>{{ helpTopic.title }}</span>
                        <i class="ie-arrow-right"></i>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    .actionButton
    {
        @apply transition duration-200 text-xl text-gray-600 bg-gray-100 border-2 rounded-lg w-[55px] aspect-square flex justify-center items-center;
    
        &.addTopic:not([disabled])
        {
            @apply hover:text-green-500 hover:border-green-500;
        }

        &.addTopic[disabled]
        {
            @apply text-gray-400;
        }
    }

    .topics
    {
        @apply flex flex-col;

        .topic
        {
            @apply flex justify-between items-center;
            @apply px-5 py-4 [&:not(:last-child)]:border-b transition duration-200 hover:bg-gray-50;

            i
            {
                @apply transition duration-200 text-lg text-gray-400 mr-2;
            }

            &:hover i { @apply text-gray-600; }
        }
    }
</style>