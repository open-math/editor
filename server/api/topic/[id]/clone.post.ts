import getDb from "~/server/db";
import Topic from "~/server/db/entity/Topic";
import { cloneAssets } from "~/server/utils/asset";
import getLoggedUserId from "~/server/utils/ensureLogged";
import { getTopicIdFromParam } from "~/server/utils/topic";
import { canCreateTopic } from "~/server/utils/user";

export default defineEventHandler(async event =>
{
    const topicId = getTopicIdFromParam(event);

    if (!topicId)
        return createError('Некорректный идентификатор темы!');

    const userId = await getLoggedUserId(event, false);

    if (!(await canSeeTopic(topicId, userId)))
        return setResponseStatus(event, 403);

    if (!(await canCreateTopic(userId)))
        return setResponseStatus(event, 403);

    //

    const db = await getDb();
    const dbTopic = await db.manager.findOneBy(Topic, { id: topicId });

    if (!dbTopic)
        return 0;

    const dbCloneTopic = new Topic;

    Object.getOwnPropertyNames(dbTopic).forEach(key => {
        //@ts-ignore
        dbCloneTopic[key] = dbTopic[key];
    });

    dbCloneTopic.id = undefined as any;
    dbCloneTopic.private = undefined as any;
    dbCloneTopic.lastEdit = undefined as any;

    dbCloneTopic.userId = userId;
    dbCloneTopic.title += ' [Копия]';

    const cloneTopicId = (await db.manager.save(dbCloneTopic)).id;

    cloneAssets(dbTopic.id, cloneTopicId);

    return cloneTopicId;
});