import type { WatchStopHandle } from "vue";
import type { Asset } from "~/server/utils/asset";
import type { UniquesGrouped } from "~/assets/translator/unique";
import type { TTopicSaveData } from "~/server/api/topic/[id]/save.post";

export type TTopic = {
    canEdit:        boolean;
    topicId:        number;
    title:          string;
    desc:           string;
    tags:           string;
    contributors:   string;
    macros:         string;
    private:        boolean;
    article:        string;
    summary:        string;
    practicum:      string;
}

//
//
//

export const useTopic = defineStore('topic', () => {
    const topicId = ref(0);
    const canEdit = ref(false);
    const title =   ref('');
    const desc =    ref('');
    const tags =    ref('');
    const contributors = ref('');
    const macros =  ref('');
    const privateMode = ref(false);

    const article =     ref('');
    const summary =     ref('');
    const practicum =   ref('');

    const uniques = ref<UniquesGrouped>();

    //
    
    const changed = ref(false);
    const saving =  ref(false);

    //

    let unwatchers: WatchStopHandle[] = [];

    async function fetchTopic(id: number)
    {
        unwatchers.forEach(unwatch => unwatch());

        const { data } = await useFetch<TTopic>(`/api/topic/${id}`, {
            headers: useRequestHeaders(['cookie'])
        });

        if (!data || !data.value?.topicId)
            throw createError('Ошибка при получении данных темы!');

        topicId.value = data.value.topicId;
        canEdit.value = data.value.canEdit;
        title.value =   data.value.title;
        desc.value =    data.value.desc;
        tags.value =    data.value.tags;
        contributors.value = data.value.contributors;
        macros.value =  data.value.macros;
        privateMode.value = data.value.private;

        article.value =     data.value.article;
        summary.value =     data.value.summary;
        practicum.value =   data.value.practicum;

        changed.value = false;
        saving.value = false;

        if (process.client)
            watchChanges();
    }

    function watchChanges()
    {
        [title, desc, tags, contributors, macros, privateMode, article, summary, practicum].forEach(ref => {
            unwatchers.push(watch(ref, () => changed.value = true));
        });
    }

    function reset()
    {
        uniques.value = undefined;
    }

    //

    const canSave = computed(() => changed.value && !saving.value);

    const macrosObj = computed(() => {
        let _macros = {};
        try { _macros = JSON.parse(toRaw(macros.value)); } catch {}
        return _macros;
    });

    async function save()
    {
        if (saving.value)
            return;

        saving.value = true;
        changed.value = false;

        let toSave: Partial<TTopicSaveData> = {
            title:      title.value,
            desc:       desc.value,
            tags:       tags.value,
            contributors: contributors.value,
            macros:     macros.value,
            private:    privateMode.value,
            article:    article.value,
            summary:    summary.value,
            practicum:  practicum.value
        };

        const saveResult = await $fetch(`/api/topic/${topicId.value}/save`, {
            method: 'post',
            headers: useRequestHeaders(['cookie']),
            body: toSave
        });

        console.log('Save result: ' + saveResult);

        saving.value = false;
    }

    //

    return {
        changed,
        saving,

        topicId,
        title,
        desc,
        tags,
        contributors,
        macros,
        privateMode,
        macrosObj,
        article,
        summary,
        practicum,

        canEdit,
        fetchTopic,

        canSave,
        save,

        uniques,

        reset,
    }
});