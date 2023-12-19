<script setup lang="ts">
    import { useTopic } from '~/store/topic';
    import { useTopicPreview } from '~/store/topicPreview';
    import { useTopicUI } from '~/store/topicUI';

    definePageMeta({
        middleware: 'can-open-topic'
    });

    const topicId = +useRoute().params.id;

    const topic = useTopic();
    topic.reset();
    await topic.fetchTopic(topicId);

    const topicUi = useTopicUI();
    topicUi.reset();

    useHead({
        title: computed(() => topic.title)
    });

    if (process.client)
    {
        const topicPreview = useTopicPreview();
        topicPreview.reset();

        topicPreview.data.topicId = toRaw(topic.topicId);
        topicPreview.data.macros =  topic.macrosObj;
        watch(() => topic.macros, () => topicPreview.data.macros = topic.macrosObj);
    }

    //
    // Leave confirm
    //

    function leaveConfirmMsg() { return 'Несохраненные изменения будут потеряны!'; }

    if (process.client)
        window.onbeforeunload = () => {
            if (topic.changed)
                return leaveConfirmMsg();

            window.onbeforeunload = null;
        };

    onBeforeRouteLeave(async leaveGurad => {
        if (!topic.changed)
            return true;

        return confirm(leaveConfirmMsg());
    });

    //
    // Save hotkey
    //

    if (process.client)
        document.addEventListener("keydown", function(e) {
            if ((e.ctrlKey || e.metaKey) && e.code === "KeyS") {
                e.preventDefault();

                if (topic.canEdit && topic.canSave)
                    topic.save();
            }
        });
</script>

<template>
    <TopicAsideMenu />
    <TopicAsidePanes>
        <TopicAsidePaneMain />
        <TopicAsidePaneInfo />
        <TopicAsidePaneAssets />
        <TopicAsidePaneUniques />
    </TopicAsidePanes>
    <main>
        <TopicHeader />
        <TopicEditor />
    </main>
</template>

<style>
    :root
    {
        --asideMenu: 50px;
        --asidePane: 250px;
    }
</style>

<style scoped>
    :root
    {
        @apply bg-slate-900;
    }

    main
    {
        @apply absolute z-10 top-0 right-0 left-[var(--asideMenu)] h-screen;
        @apply transition-[left] duration-200;

        aside.panes.opened + &
        {
            left: calc(var(--asideMenu) + var(--asidePane));
        }
    }
</style>