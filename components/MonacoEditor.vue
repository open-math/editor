<script setup lang="ts">
    import loader from "@monaco-editor/loader";
    import { useTopic } from "~/store/topic";
    import { useTopicUI } from "~/store/topicUI";
    import { useTopicPreview } from "~/store/topicPreview";

    const topic = useTopic();
    const topicUi = useTopicUI();
    const editor = ref();

    onMounted(() => {
        loader.config({
            'vs/nls': {
                availableLanguages: { '*': 'ru' }
            }
        });

        loader.init().then(monaco => {
            const _editor = monaco.editor.create(editor.value, {
                value: topic[topicUi.tab],
                language: 'markdown',
                automaticLayout: true,
                readOnly: !topic.canEdit,
                wordWrap: 'on',
                readOnlyMessage: { value: 'Только владелец темы может вносить изменения!' },
                padding: { top: 30 },
                renderWhitespace: 'all',
                theme: 'vs-dark',
            });

            monaco.editor.defineTheme('omath', {
                base: 'vs-dark',
                inherit: true,
                rules: [],
                colors: {
                    "editor.background": "#0f172a",
                }
            });

            monaco.editor.setTheme('omath');

            let changeTimeout;
            let changeDelay = 1000;

            _editor.getModel()?.onDidChangeContent(() => {
                topic[topicUi.tab] = _editor.getValue();
                clearTimeout(changeTimeout);
                changeTimeout = setTimeout(() => useTopicPreview().renderTab(), changeDelay);
            });

            watch(() => topicUi.tab, () => {
                let _ = changeDelay;
                changeDelay = 0;
                _editor.setValue(topic[topicUi.tab]);
                changeDelay = _;
            });
        });
    });
</script>

<template>
    <div ref="editor"></div>
</template>