import { getTokenUserId } from "../auth";

export default async function getLoggedUserId(event: any, setErrorStatus = true)
{
    const userId = await getTokenUserId(getCookie(event, 'token'))

    if (!userId)
    {
        if (setErrorStatus) setResponseStatus(event, 401);
        return 0;
    }

    return userId;
}