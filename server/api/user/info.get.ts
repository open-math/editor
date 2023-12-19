import getDb from "~/server/db";
import User from "~/server/db/entity/User";
import { getUserTopicsListInfo } from "~/server/db/repo/User";
import getLoggedUserId from "~/server/utils/ensureLogged";

export default defineEventHandler(async event => {
    const userId = await getLoggedUserId(event);

    if (!userId)
        return;

    const db = await getDb();
    const dbUser = await db.manager.findOneBy(User, { id: userId });

    if (!dbUser)
        return setResponseStatus(event, 404);

    return {
        id:         dbUser.id,
        login:      dbUser.login,
        isEditor:   dbUser.isEditor,
        topics:     await getUserTopicsListInfo(userId),
    };
});