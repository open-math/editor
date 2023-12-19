import { getTokenUserId, removeToken } from "~/server/auth";

export enum TActionType 
{
    Get = 'get',
    Delete = 'delete'
}

export default defineEventHandler(async event =>
{
    const token = event.context.params?.token ?? '';
    const body = await readBody(event);

    if (!token || !body?.action)
        return;

    const action = body.action as TActionType;

    switch (action)
    {
        case TActionType.Delete:
            await removeToken(token);
            return;
        case TActionType.Get:
            return await getTokenUserId(token);
    }
});