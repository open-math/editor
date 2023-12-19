import { getState, clearAssets, addFolder, removeAsset } from "~/server/utils/asset";
import getLoggedUserId from "~/server/utils/ensureLogged";

enum Command {
    State = 'state',
    Clear = 'clear',
    AddFolder = 'addDir',
    RemoveAsset = 'rm',
}

export default defineEventHandler(async event =>
{
    const body = await readBody(event);
    const command = body.command as Command;

    if (!Object.values(Command).includes(command))
        throw new Error('Неизвестная команда!');

    const topicId = getTopicIdFromParam(event);

    if (!topicId)
        return createError('Некорректный идентификатор темы!');

    const userId = await getLoggedUserId(event);

    if (!(await canSeeTopic(topicId, userId)))
        return setResponseStatus(event, 403);

    //

    if (command === Command.State)
        return await getState(topicId);

    if (!(await canEditTopic(topicId, userId)))
        return setResponseStatus(event, 403);

    //

    try
    {
        switch (body.command)
        {
            case Command.Clear:
                await clearAssets(topicId);
                break;
            case Command.RemoveAsset:
                await removeAsset(topicId, body.path);
                break;
            case Command.AddFolder:
                await addFolder(topicId, body.path, body.dirName);
                break;
        }
    }
    catch (e) { console.error(e); }

    return await getState(topicId);
});