export default defineEventHandler(async event =>
{
    const body = await readBody(event);
    return canSeeTopic(body.topicId, body.userId);
});