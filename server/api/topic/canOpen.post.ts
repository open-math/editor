export default defineEventHandler(async event =>
{
    const body = await readBody(event);
    return await canSeeTopic(body.topicId, body.userId);
});