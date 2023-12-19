import crypto from "crypto";

import User from "~/server/db/entity/User";
import getDb from "../db";
import Topic from "../db/entity/Topic";

export function initUserFrom(initialData: { login: string, email: string, password: string })
{
    let user = new User;
        user.login = initialData.login;
        user.email = initialData.email;

    let salt = crypto.randomBytes(16).toString('hex');
    let hash = getHash(salt, initialData.password);

        user.salt = salt;
        user.hash = hash;

    return user;
}

export function getHash(salt: string, password: string)
{
    return crypto.createHash('sha512').update(password + salt).digest('hex');
}

export async function canCreateTopic(userId: number)
{
    const config =  useRuntimeConfig();
    const db =      await getDb();
    const dbUser =  await db.manager.findOneBy(User, { id: userId });
    
    if (dbUser?.isEditor)
        return true;

    const userTopicCount = await db.manager.countBy(Topic, { userId });

    return userTopicCount < config.public.maxTopics;
}