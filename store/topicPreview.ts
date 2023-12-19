import chalk from "chalk";

import { _renderTab, initWorker } from "~/assets/translator/client";
import type { IRequestBaseData } from "~/assets/translator/io";

export const useTopicPreview = defineStore('topicPreview', () =>
{
    const dataReady =   ref(false);
    const iframeReady = ref(false);
    const workerReady = ref(false);

    const allReady = computed(() => dataReady.value && iframeReady.value && workerReady.value);

    const data = reactive<Partial<IRequestBaseData>>({});

    //
    //
    //

    watch([dataReady, iframeReady, workerReady], () => {
        let stateMsg = (label: string, isReady: boolean) =>
        {
            let color = isReady ? chalk.green : chalk.red;
            return color(label);
        }

        logMessage(`Ready state change: ${stateMsg('Data', dataReady.value)} ${stateMsg('IFrame', iframeReady.value)} ${stateMsg('Worker', workerReady.value)}`);

        if (allReady.value)
        {
            logMessage(chalk.green.bold('All ready!'));
            renderTab();
        }
    });

    watch(data, () => {
        if (dataReady.value)
            return;

        let checkKeys: Array<keyof IRequestBaseData> = [
            'topicId',
            'assets',
            'macros'
        ];

        for(let key of checkKeys)
        {
            if (!(key in data))
                return;
        }

        dataReady.value = true;

        initWorker();
    });

    //
    //
    //

    function fullWidth() {}
    function tabletWidth() {}
    function mobileWidth() {}

    //
    //
    //

    function renderTab()
    {
        if (allReady.value)
            _renderTab();
    }

    //
    //
    //

    function reset()
    {
        if (allReady.value)
            logMessage(chalk.hex('#FFA500')('Reset!'));

        for(let key of Object.keys(data))
            delete data[key];

        dataReady.value = iframeReady.value = workerReady.value = false;
    }

    return {
        dataReady,
        iframeReady,
        workerReady,

        data,

        allReady,

        renderTab,

        fullWidth,
        tabletWidth,
        mobileWidth,

        reset,
    }
});

function logMessage(msg: string)
{
    console.log(chalk.cyan('[Topic Preview]') + ' ' + msg);
}