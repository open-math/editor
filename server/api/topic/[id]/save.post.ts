import getDb from "~/server/db";
import Topic from "~/server/db/entity/Topic";
import getLoggedUserId from "~/server/utils/ensureLogged";
import { getTopicIdFromParam } from "~/server/utils/topic";

export type TTopicSaveData = {
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
    const body = await readBody(event) as TTopicSaveData;

    const maxLength = 100000;

    body.article =      body.article.slice(0, maxLength);
    body.summary =      body.summary.slice(0, maxLength);
    body.practicum =    body.practicum.slice(0, maxLength);

    await db.manager.update(Topic, { id: topicId }, {...body, lastEdit: new Date});

    return true;
});