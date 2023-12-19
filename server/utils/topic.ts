import getDb from "~/server/db";
import Topic from "~/server/db/entity/Topic";

export async function canSeeTopic(topicId: number, userId: number)
{
    const db = await getDb();
    const dbTopic = await db.manager.findOne(Topic, {
        select: ['private', 'userId'],
        where: { id: topicId }
    });

    if (!dbTopic)
        return false;

    if (!dbTopic.private)
        return true;

    return userId === dbTopic.userId;
}

export async function canEditTopic(topicId: number, userId: number)
{
    if (!userId)
        return false;

    const db = await getDb();
    const dbTopic = await db.manager.findOne(Topic, {
        select: ['userId'],
        where: { id: topicId },
    });

    return userId === dbTopic?.userId;
}

export function getTopicIdFromParam(event: any)
{
    let topicId = getRouterParam(event, 'id');

    if (!topicId)
        return 0;

    return +topicId;
}