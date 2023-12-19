<script setup lang="ts">
    import type { AssetState, Asset } from '~/server/utils/asset';
    import { useTopic } from '~/store/topic';
    import { useTopicPreview } from '~/store/topicPreview';

    const topic = useTopic();
    const topicPreview = useTopicPreview();

    //

    const path = ref('');
    const state = ref() as Ref<AssetState>;
    const refreshing = ref(true);

    await callAssetAPI('state');

    watch(() => state.value, () => {
        useTopicPreview().renderTab();

        if (isRootPath.value)
            return;

        let fallbackPaths = [''];

        let pathParts = path.value.split('/');
        for (let i = 0; i < pathParts.length + 1; i++)
            fallbackPaths.push(pathParts.slice(0, i).join('/'));

        for (let fallbackPath of fallbackPaths.reverse())
        {
            if (dirs.value.includes(fallbackPath))
            {
                path.value = fallbackPath;
                break;
            }
        }
    });

    const isRootPath = computed(() => path.value === '');

    const assetList = computed(() => {
        return state.value.assets.filter(asset => {
            if (isRootPath.value)
                return asset.path.split('/').length === 1;

            return asset.path.startsWith(path.value + '/');
        });
    });

    const dirTitle = computed(() => {
        if (isRootPath.value)
            return 'Файлы';

        return path.value.split('/').pop();
    });

    const dirs = computed(() => {
        return [...state.value.assets.filter(asset => asset.directory).map(asset => asset.path), ''];
    });

    //

    async function back()
    {
        if (isRootPath.value)
            return;

        let pathParts = path.value.split('/');
            pathParts.pop();

        path.value = pathParts.join('/');
    }

    async function clearAssets()
    {
        if (confirm('Удалить все файлы?'))
            await callAssetAPI('clear');
    }

    async function removeAsset(targetPath?: string)
    {
        if (confirm('Удалить?'))
            await callAssetAPI('rm', { path: targetPath ?? path.value });
    }

    async function createDir()
    {
        const dirName = prompt('Название папки:');

        if (!dirName)
            return;

        await callAssetAPI('addDir', { path: path.value, dirName });
    }

    async function assetClick(asset: Asset)
    {
        if (asset.directory)
        {
            path.value += (path.value ? '/' : '') + asset.path.split('/').pop();
            return;
        }

        navigator.clipboard.writeText('assets/' + asset.path);
    }

    //

    async function uploadAsset()
    {
        refreshing.value = true;

        await new Promise<void>(resolve => {
            let fileInput = document.createElement('input');
                fileInput.setAttribute('type', 'file');
                fileInput.onchange = async e => {
                    let file = (e.target as any).files[0];
                    let fd = new FormData;
                        fd.append('asset', file);

                        try
                        {
                            const result = await $fetch(`/api/topic/${topic.topicId}/upload?${path.value}`, {
                                method: 'post',
                                headers: useRequestHeaders(['cookie']),
                                body: fd
                            });

                            state.value = result as AssetState;
                            topicPreview.data.assets = state.value.assets;
                        }
                        catch {}

                    fileInput.remove();
                    resolve();
                };

            document.body.append(fileInput);
            fileInput.click();
        });

        refreshing.value = false;
    }

    async function callAssetAPI(command: string, data: object = {})
    {
        refreshing.value = true;

        const result = await $fetch(`/api/topic/${topic.topicId}/asset`, {
            method: 'post',
            headers: useRequestHeaders(['cookie']),
            body: {
                command,
                ...data
            }
        });

        if (!result)
            throw createError('Проблемы при попытке обращения к файлам темы!');
        
        state.value = result as AssetState;
        topicPreview.data.assets = state.value.assets;
        refreshing.value = false;
    }
</script>

<template>
    <TopicAsidePane name="assets">
        <div class="overlay" :class="{ showing: refreshing }"><i class="ie-arrows-rotate"></i></div>
        <header>
            <button v-if="!isRootPath" class="back" @click="back" title="Назад"><i class="ie-arrow-right"></i></button>
            <div class="title" :class="{ 'pl-4': isRootPath }">{{ dirTitle }}</div>
            <button v-if="!isRootPath && topic.canEdit" @click="removeAsset()" class="remove" title="Удалить папку"><i class="ie-trash-can"></i></button>
        </header>
        <TopicAsideScroller class="assetList">
            <div v-if="assetList.length === 0" class="text-gray-500 text-center mt-3">Файлов нет!</div>
            <div v-else v-for="asset in assetList" class="asset">
                <template v-if="!asset.directory">
                    <div class="absolute w-[70%] right-0 h-full overflow-hidden">
                        <TopicAssetPreview :topic-id="topic.topicId" :asset="asset" />
                    </div>
                    <div class="absolute z-10 w-full h-full bg-slate-800 opacity-70"></div>
                    <div class="absolute z-20 right-0 w-full h-full bg-gradient-to-r from-slate-800 from-30% to-transparent"></div>
                </template>
                <div class="data">
                    <div class="title"><span @click="assetClick(asset)" :title="asset.title">{{ asset.title }}</span></div>
                    <div class="secondary">
                        <template v-if="asset.directory">
                            <div>Папка</div>
                        </template>
                        <template v-else>
                            <div>{{ asset.type }}</div>
                            <div>{{ parseFloat(asset.size.toFixed(1)) }} Мб</div>
                        </template>
                        <button v-if="topic.canEdit" @click="removeAsset(asset.path)" class="remove" title="Удалить"><i class="ie-trash-can"></i></button>
                    </div>
                </div>
            </div>
        </TopicAsideScroller>
        <footer v-if="topic.canEdit">
            <div class="actions">
                <button @click="uploadAsset" :disabled="!state.createAllowed" title="Добавить файл"><i class="ie-file-circle-plus"></i></button>
                <button @click="createDir" :disabled="!state.createAllowed" title="Добавить папку"><i class="ie-folder-plus"></i></button>
            </div>
            <div class="status">
                <div :class="{ alert: state.exceedAssets }"><i class="ie-files"></i> {{ state.totalAssets }}</div>
                <div :class="{ alert: state.exceedSize }"><i class="ie-database"></i> {{ parseFloat(state.totalSize.toFixed(1)) }} Мб</div>
                <div @click="clearAssets" class="clear" title="Удалить все файлы"><i class="ie-trash-can"></i></div>
            </div>
        </footer>
    </TopicAsidePane>
</template>

<style scoped lang="scss">
    .pane.assets
    {
        @apply relative flex flex-col;
    }

    .overlay
    {
        @apply absolute z-50 left-0 top-0 right-0 bottom-0 flex justify-center items-center bg-slate-800;
        @apply transition-[opacity] duration-200;

        &:not(.showing)
        {
            opacity: 0;
            pointer-events: none;
            touch-action: none;
        }
        
        > i
        {
            @apply text-[50px] text-gray-500 animate-spin;
        }
    }

    header
    {
        @apply flex items-center border-b border-slate-700;

        > .back, > .remove
        {
            @apply shrink-0 py-3 px-4 text-gray-600 text-[18px] transition-[color] duration-200;
        }

        > .back
        {
            @apply px-3 hover:text-gray-300;
            transform: rotate(-90deg);
        }

        > .title
        {
            @apply py-3 flex-1 font-semibold text-gray-400 text-lg;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        > .remove
        {
            @apply hover:text-red-700;
        }
    }

    .assetList
    {
        @apply flex-1;

        > .asset
        {
            @apply relative border-b border-slate-700;

            > .data
            {
                @apply relative z-40 flex flex-col gap-1 p-4 text-gray-600;

                > .title
                {
                    @apply text-gray-400;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    > span
                    {
                        @apply cursor-pointer transition-[color,text-decoration-color] duration-200 hover:text-gray-300;
                        text-decoration: underline;
                        text-decoration-color: transparent;

                        &:hover { text-decoration-color: inherit; }
                    }
                }

                > .secondary
                {
                    @apply flex items-center gap-4;

                    > *
                    {
                        min-width: 30px;
                    }

                    > button
                    {
                        @apply transition-[color] duration-200 hover:text-gray-300;

                        position: relative;
                        top: 1px;

                        &.remove { @apply hover:text-red-600; }
                    }
                }
            }
        }
    }

    footer
    {
        @apply border-t border-slate-700;

        > .actions
        {
            @apply relative flex;

            > button
            {
                @apply flex-1 p-4 text-[25px] text-gray-500 transition duration-200 hover:text-gray-300;

                &[disabled] { @apply text-slate-600; }

                &:first-of-type
                {
                    @apply border-r border-slate-700;
                }
            }
        }

        > .status
        {
            @apply flex justify-center gap-5 py-4 border-t border-slate-700;

            > div
            {
                @apply flex items-center gap-2 text-slate-600 text-lg;
                @apply transition-[color] duration-200;

                &.alert, &.clear:hover { @apply text-red-700; }

                &.clear { cursor: pointer; }

                > i { position: relative; top: 1px; }
            }
        }
    }
</style>