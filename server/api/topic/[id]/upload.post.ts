import getLoggedUserId from "~/server/utils/ensureLogged";
import formidable from "formidable";
import { assetPath, dirExists, getState } from "~/server/utils/asset";

export default defineEventHandler(async event =>
{
    const topicId = getTopicIdFromParam(event);
    const userId = await getLoggedUserId(event);
    const assetDir = retrieveAssetPath(event.path);

    //

    const checkResults = await Promise.all([
        canEditTopic(topicId, userId),
        canAddAsset(topicId),
        dirExists(topicId, assetDir),
    ]);

    if (checkResults.includes(false))
        return setResponseStatus(event, 403);

    //

    const config = useRuntimeConfig();

    const form = formidable({
        maxFiles: 1,
        maxFileSize: config.public.maxAssetSize * 1024 * 1024,
        keepExtensions: true,
        filename: (name, ext) => name + ext,
        uploadDir: assetPath(topicId, assetDir),
        createDirsFromUploads: true,
    });

    await form.parse(event.node.req);

    return await getState(topicId);
});

function retrieveAssetPath(url: string)
{
    let assetPath = url.slice(url.indexOf('?') + 1);
    
    if (assetPath === url)
        return '';

    return assetPath === url ? '' : assetPath;
}