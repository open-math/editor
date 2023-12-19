import getLoggedUserId from "~/server/utils/ensureLogged";

export default defineEventHandler(async event => 
{
    const userId = await getLoggedUserId(event);

    if (!userId)
        return;

    if (!canCreateTopic(userId))
        return setResponseStatus(event, 403);

    //

    const url = (await readBody(event)).url;

    if (!url)
        return;

    console.log(url);
});