import getDb from "~/server/db";
import User from "~/server/db/entity/User";
import UserConfirm from "~/server/db/entity/UserConfirm";

export default defineEventHandler(async event =>
{
    let key = event.context.params?.key;

    if (!key)
        return;

    const db = await getDb();

    let dbUserConfirm = await db.manager.findOne(UserConfirm, { where: { confirmKey: key } });

    if (!dbUserConfirm)
        return;

    let userId = dbUserConfirm.userId;
    let dbUser = await db.manager.findOne(User, { where: { id: userId } }) as User;
        dbUser.confirmed = true;

    await db.manager.save(dbUser);
    await db.manager.remove(dbUserConfirm);

    await sendRedirect(event, '/auth?confirmed=1');
});