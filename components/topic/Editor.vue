<script setup lang="ts">
    import { setIFrame } from '~/assets/iframe';
    import { useTopicPreview } from '~/store/topicPreview';

    const topicPreview = useTopicPreview();

    topicPreview.$onAction(action => {
        switch (action.name)
        {
            case 'fullWidth':
                clearCustomWidth();
                break;
            case 'tabletWidth':
                setCustomWidth('calc(100% - 620px)');
                break;
            case 'mobileWidth':
                setCustomWidth('calc(100% - 340px)');
                break;
        }
    });

    const iframe = ref<HTMLIFrameElement>();
    const grip = ref() as Ref<HTMLElement>;
    const editor = ref() as Ref<HTMLElement>;

    const resizing = ref(false);

    function preivewEventListener(e: MessageEvent<any>)
    {
        if (e.data === 'preview-ready')
        {
            setIFrame(iframe.value);
            topicPreview.iframeReady = true;
        }
    }

    function mouseMove(e: MouseEvent)
    {
        if (!resizing.value)
                return;

        setCustomWidth(editor.value.clientWidth + e.movementX + 'px');
    }

    function mouseUp()
    {
        resizing.value = false;
    }

    function clearCustomWidth()
    {
        editor.value.removeAttribute('style');
    }

    function setCustomWidth(width: string)
    {
        editor.value.setAttribute('style', `flex: 0 1 auto; width: ${width}`);
    }

    onMounted(() =>
    {
        if (!iframe.value)
            throw createError(`Can't find preview 'iframe' DOM element!`);

        window.addEventListener('message', preivewEventListener);

        iframe.value.src = '/preview';

        // Resizing

        grip.value.addEventListener('mousedown', () => {
            resizing.value = true;
        });

        grip.value.addEventListener('dblclick', () => clearCustomWidth());

        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseup', mouseUp);
    });

    onUnmounted(() => {
        window.removeEventListener('message',   preivewEventListener);
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup',   mouseUp);
    });
</script>

<template>
    <div class="wrapper">
        <div class="editor" ref="editor">
            <ClientOnly>
                <MonacoEditor />
            </ClientOnly>
        </div>

        <div class="grip" ref="grip"><i class="ie-grip-vertical"></i></div>

        <div class="preview">
            <div class="resizeOverlay" :class="{ expanded: resizing }"></div>
            <iframe id="preview" ref="iframe"></iframe>
        </div>
    </div>
</template>

<style scoped>
    .wrapper
    {
        height: calc(100% - var(--headerHeight));

        @apply flex bg-slate-800;
    }

    .editor,
    .preview
    {
        flex: 1;
        min-width: 320px;
    }

    #preview { min-width: 320px; }

    .grip
    {
        flex-shrink: 0;
        width: 16px;
        user-select: none;
        cursor: col-resize;

        @apply flex items-center justify-center;
        @apply bg-slate-800 border-r border-l border-slate-700 text-gray-500;
    }

    .editor
    {
        > * { height: 100%; }
    }

    .preview
    {
        position: relative;
    }

    .preview .resizeOverlay
    {
        @apply absolute left-0 top-0;

        &.expanded
        {
            width: 100%;
            height: 100%;
        }
    }

    .preview iframe
    {
        width: 100%;
        height: 100%;
    }
</style>