import schedule from "node-schedule";
import getDb from "../db";
import AuthToken from "../db/entity/AuthToken";
import UserConfirm from "../db/entity/UserConfirm";

export default defineNitroPlugin(nitroApp =>
{
    schedule.scheduleJob('0 0 0 * * *', async () => { await clearDb(); });
});

//
//
//

async function clearDb()
{
    console.log('Clearing database!');

    const db = await getDb();
    const now = Date.now();

    // Cleaning auth tokens

    await db
            .createQueryBuilder()
            .delete()
            .from(AuthToken)
            .where("expires < :expire", { expire: now })
            .execute();

    // Cleaning user confirmation links

    await db
            .createQueryBuilder()
            .delete()
            .from(UserConfirm)
            .where("expires < :expire", { expire: now })
            .execute();
}