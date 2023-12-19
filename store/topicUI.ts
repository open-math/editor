import { defineStore } from "pinia";

export enum Tab {
    Article =   'article',
    Summary =   'summary',
    Practicum = 'practicum',
}

//
//
//

export const useTopicUI = defineStore('topicUI', () => {
    const pane =        ref<string | null>(null);
    const tab =         ref<Tab>(Tab.Article);
    const autoSaveId =  ref<any>(null);

    function reset()
    {
        pane.value = null;
        clearInterval(autoSaveId.value);
    }

    // TODO: Save some shit to localstorage

    return {
        pane,
        tab,
        autoSaveId,
        reset,
    };
});