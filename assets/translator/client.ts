import TranslatorWorker from "./worker?worker";
import { useTopic } from "~/store/topic";
import { InitRequest, RenderRequest, type TResponseLike, type IRequestBaseData } from "./io";
import { setContent } from "../iframe";
import { useTopicUI } from "~/store/topicUI";
import { useTopicPreview } from "~/store/topicPreview";

let worker: Worker;

export function initWorker()
{
    if (!worker)
    {
        worker = new TranslatorWorker();
        worker.onmessage = e => onWorkerResponse(e.data);
    }

    const topic = useTopic();

    let initRequest = createRequest(InitRequest) as InitRequest;
        initRequest.article =   topic.article;
        initRequest.summary =   topic.summary;
        initRequest.practicum = topic.practicum;

    worker.postMessage(initRequest);
}

export function _renderTab()
{
    const topicUI = useTopicUI();
    const tab = topicUI.tab;

    const topic = useTopic();

    let request = createRequest(RenderRequest) as RenderRequest;
        request.topicPart = tab;
        request.content =   topic[tab];

    worker.postMessage(request);
}

function onWorkerResponse(response: TResponseLike)
{
    if (response === 'translator-ready')
    {
        useTopicPreview().workerReady = true;
        return;
    }

    const topic = useTopic();
    topic.uniques = response.uniques;

    setContent(response.rendered.content, response.rendered.uniques);
}

//

function createRequest(TRequest: new() => InitRequest | RenderRequest)
{
    const topicPreview = useTopicPreview();
    const data = toRaw(topicPreview.data) as IRequestBaseData;

    let request = new TRequest;
        request.topicId =   data.topicId;
        request.assets =    data.assets;
        request.macros =    data.macros;

    return request;
}