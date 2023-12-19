import crypto from 'crypto';

import getDb from "~/server/db";
import User from "~/server/db/entity/User";
import UserConfirm from "~/server/db/entity/UserConfirm";
import Letter from '~/server/mail/Letter';
import sendMail from '~/server/mail';
import { createToken } from '../auth';
import { getHash, initUserFrom } from '../utils/user';

export type TResult = { error?: string, token?: string };

const config = useRuntimeConfig();

export default eventHandler(async event =>
{
    let body = await readBody(event);

    let valudateMsg = validate(body);
    if (typeof valudateMsg === 'string')
        return valudateMsg;

    const { isLogin, login, email, password } = body;

    return isLogin ? await signIn(email, password, event) : await signUp(login, email, password);
});

async function signIn(email: any, password: any, event: any): Promise<TResult>
{
    const errorResult = (errorMsg = 'Некорректные почта или пароль!') =>
    {
        return { error: errorMsg };
    }

    const db = await getDb();
    const dbUser = await db.manager.findOne(User, { where: { email: email } }) as User;

    if (!dbUser)
        return errorResult();

    if (!dbUser.confirmed)
        return errorResult('Пользователь не подтвержден!');

    if (dbUser.hash !== getHash(dbUser.salt, password))
        return errorResult();

    const token = await createToken(dbUser.id);
    return { token: token };
}

//
// Sign up
//

async function signUp(login: any, email: any, password: any): Promise<TResult>
{
    const db = await getDb();

    if (await db.manager.exists(User, { where: { email: email } }))
        return { error: 'Уже есть пользователь с такой почтой!' };

    let newUser = getNewUser(login, email, password);

    await db.manager.transaction(async manager =>
    {
        let newUserId = (await manager.save(newUser)).id;
        let userConfirm = generateUserConfirm(newUserId);
        await manager.save(userConfirm);
        await sendConfirmLetter(newUser.email, userConfirm.confirmKey);
    });

    return {};
}

function getNewUser(login: string, email: string, password: string)
{
    let user = initUserFrom({ login, email, password });
        user.confirmed = false;

    return user;
}

function generateUserConfirm(userId: number)
{
    let userConfirm = new UserConfirm;
        userConfirm.userId = userId;
        userConfirm.confirmKey = crypto.randomBytes(32).toString('hex');

    let expireData = new Date;
        expireData.setDate(expireData.getDate() + 1);

        userConfirm.expires = expireData.getTime();

    return userConfirm;
}

async function sendConfirmLetter(targetMail: string, confirmKey: string)
{
    let link = config.url + 'api/confirm/' + confirmKey

    let letter = new Letter;
        letter.to =         targetMail;
        letter.subject =    'Подтверждение регистрации';
        letter.body =       `Для завершения регистрации перейдите по <a href="${link}">ссылке</a>!`;

    await sendMail(letter);
}

//
//
//

function validate(data: any)
{
    const { isLogin, login, email, password } = data;

    let errorMsg = { error: 'Некорректные данные!' };

    for (let value of [isLogin, login, email, password])
        if (typeof value === 'undefined')
            return errorMsg;

    for (let value of [email, password])
        if (value.length === 0)
            return errorMsg;

    if (!isLogin)
        if (login.length === 0)
            return errorMsg;
}