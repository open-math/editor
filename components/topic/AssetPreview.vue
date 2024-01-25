<script setup lang="ts">
    import type { Asset } from "~/server/utils/asset";

    const props = defineProps<{
        topicId: number,
        asset: Asset,
    }>();

    const loaded = ref(false);

    const type = computed(() => {
        if (['mp4', 'webm'].includes(props.asset.type))
            return 'video';
        else if (['png', 'svg', 'jpg', 'jpeg', 'gif', 'webp'].includes(props.asset.type))
            return 'image';

        return 'unknown';
    });

    const src = computed(() => {
        return `/asset/${props.topicId}/${props.asset.path}`;
    });
</script>

<template>
    <template v-if="type === 'image'">
        <img :src="src" :load="loaded = true" :class="{ loaded }">
    </template>
    <template v-else-if="type === 'video'">
        <video playsinline muted loop autoplay :src="src" :class="{ loaded }" :on-loadedmetadata="loaded = true"></video>
    </template>
</template>

<style scoped lang="scss">
    img, video
    {
        @apply absolute right-0 h-full object-cover;
        @apply opacity-0 transition-[opacity] duration-200;

        &.loaded
        {
            opacity: 1;
        }
    }
</style>