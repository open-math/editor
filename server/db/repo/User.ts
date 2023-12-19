import getDb from "..";
import Topic from "../entity/Topic";

export async function getUserTopicNumber(userId: number)
{
    const db = await getDb();
    return await db.manager.countBy(Topic, { userId: userId });
}

export async function getUserTopicsListInfo(userId: number)
{
    const db = await getDb();
    const topics = await db.manager.find(Topic, {
        select: ['id', 'title', 'lastEdit'],
        where: { userId: userId },
        order: { lastEdit: 'DESC' },
    })

    return topics;
}