import getDb from "~/server/db";
import Topic from "~/server/db/entity/Topic";
import getLoggedUserId from "~/server/utils/ensureLogged";
import { getTopicIdFromParam } from "~/server/utils/topic";
import { clearAssets } from "~/server/utils/asset";

export default defineEventHandler(async event =>
{
    const topicId = getTopicIdFromParam(event);

    if (!topicId)
        return createError('Некорректный идентификатор темы!');

    const userId = await getLoggedUserId(event, true);

    if (!userId || !(await canEditTopic(topicId, userId)))
        return createError('Вы не можете редактировать эту тему!');

    //

    const db = await getDb();
    await db.manager.delete(Topic, { id: topicId });
    console.log('Removing assets!');
    await clearAssets(topicId);
});