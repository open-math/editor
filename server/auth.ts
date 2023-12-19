import crypto from "crypto";

import getDb from "./db";
import AuthToken from "./db/entity/AuthToken";

export async function createToken(userId: number)
{
    const token = crypto.randomBytes(64).toString('hex');

    let dbAuthToken = new AuthToken;
        dbAuthToken.token = token;
        dbAuthToken.expires = getExpires();
        dbAuthToken.userId = userId;

    const db = await getDb();
    await db.manager.save(dbAuthToken);

    return token;
}

export async function getTokenUserId(token?: string)
{
    if (!token)
        return 0;

    const db = await getDb();
    const dbAuthToken = await db.manager.findOne(AuthToken, { where: { token: token } });

    if (!dbAuthToken)
        return 0;

    if (Date.now() > dbAuthToken.expires)
    {
        await db.manager.remove(dbAuthToken);
        return 0;
    }

    dbAuthToken.expires = getExpires();
    await db.manager.save(dbAuthToken);

    return dbAuthToken.userId;
}

export async function removeToken(token: string)
{
    const db = await getDb();
    const dbAuthToken = await db.manager.findOne(AuthToken, { where: { token: token } });

    if (dbAuthToken)
        await db.manager.remove(dbAuthToken);
}

//
//
//

function getExpires()
{
    const expires = new Date;
    expires.setDate(expires.getDate() + 1);
    return expires.getTime();
}