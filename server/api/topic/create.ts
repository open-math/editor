import getDb from "~/server/db";
import Topic from "~/server/db/entity/Topic";
import getLoggedUserId from "~/server/utils/ensureLogged";

const titles = [
    'Начала 📐',
    'Арифметика 💯',
    'Конические сечения 📜',
];

export default defineEventHandler(async event =>
{
    const userId = await getLoggedUserId(event);

    if (!userId)
        return;

    if (!canCreateTopic(userId))
        return setResponseStatus(event, 403);

    //

    const dbTopic = new Topic;
    dbTopic.userId = userId;
    dbTopic.title = titles[Math.floor(Math.random()*titles.length)];

    return (await (await getDb()).manager.save(dbTopic)).id;
});