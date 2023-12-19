
import { Command } from "preview";
import { useTopicPreview } from "~/store/topicPreview";

let iframe: HTMLIFrameElement;

async function sendToIFrame(message: any)
{
    const topicPreview = useTopicPreview();

    if (!topicPreview.iframeReady)
    {
        console.warn('Trying to access preview iframe which is not ready!');
        return;
    }

    iframe.contentWindow?.postMessage(message);
}

//

export function setIFrame(newIframe: any)
{
    iframe = newIframe;
}

export function switchTheme()
{
    sendToIFrame({
        command: Command.SwitchTheme,
    });
}

export function setContent(content: string, uniques: { [id: string]: string })
{
    sendToIFrame({
        command: Command.SetContent,
        content,
        uniques,
    });
}