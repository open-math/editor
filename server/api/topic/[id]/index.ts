import getDb from "~/server/db";
import Topic from "~/server/db/entity/Topic";
import getLoggedUserId from "~/server/utils/ensureLogged";
import { getTopicIdFromParam } from "~/server/utils/topic";

export default defineEventHandler(async event =>
{
    const topicId = getTopicIdFromParam(event);

    if (!topicId)
        return createError('Некорректный идентификатор темы!');

    const userId = await getLoggedUserId(event, false);

    if (!(await canSeeTopic(topicId, userId)))
        return setResponseStatus(event, 403);

    return {
        topicId,
        canEdit: await canEditTopic(topicId, userId),
        ...await getTopicData(topicId),
    }
});

async function getTopicData(topicId: number)
{
    const db = await getDb();
    const dbTopic = await db.manager.findOneBy(Topic, { id: topicId }) as Topic;

    return {
        title:          dbTopic.title,
        desc:           dbTopic.desc,
        tags:           dbTopic.tags,
        contributors:   dbTopic.contributors,
        macros:         dbTopic.macros,
        private:        dbTopic.private,
        article:        dbTopic.article,
        summary:        dbTopic.summary,
        practicum:      dbTopic.practicum,
    }
}

