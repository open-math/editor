import getDb from "~/server/db";
import User from "~/server/db/entity/User";
import { getUserTopicsListInfo } from "~/server/db/repo/User";
import getLoggedUserId from "~/server/utils/ensureLogged";

export default defineEventHandler(async event =>
{
    const userId = await getLoggedUserId(event);

    if (!userId)
        return;

    const config = useRuntimeConfig();
    const db = await getDb();
    const dbHelpUser = await db.manager.findOneBy(User, { email: config.helpEmail });

    if (!dbHelpUser)
        return setResponseStatus(event, 404);

    return await getUserTopicsListInfo(dbHelpUser.id);
});