import getDb from "~/server/db";
import User from "~/server/db/entity/User";
import { initUserFrom } from "~/server/utils/user";

export default defineNitroPlugin(async () =>
{
    const config = useRuntimeConfig();
    const db = await getDb();

    let dbHelpUser = await db.manager.findOneBy(User, { email: config.helpEmail });

    if (dbHelpUser)
        return;

    dbHelpUser = initUserFrom({
        login:      'Открытая Математика',
        email:      config.helpEmail,
        password:   config.helpPassword,
    });

    dbHelpUser.confirmed = true;
    dbHelpUser.isEditor = true;

    await db.manager.save(dbHelpUser);
});