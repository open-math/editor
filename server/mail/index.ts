import fs from "fs";
import nodemailer, { Transporter } from "nodemailer";

import Letter from "./Letter";

const config = useRuntimeConfig();

let transporter: Transporter;

const emoji = ['🎓', '♾️', '🧠', '📐', '🎲', '🔢'];

export default async function sendMail(letter: Letter)
{
    if (config.mode === 'dev')
    {
        createFakeLetter(letter);
        return;
    }

    if (!transporter)
    {
        const config = useRuntimeConfig();

        transporter = nodemailer.createTransport({
            host: config.smtpHost,
            port: 465,
            secure: true,
            auth: {
                user: config.smtpLogin,
                pass: config.smtpPassword,
            }
        });
    }

    let cEmoji = emoji[Math.floor(Math.random()*emoji.length)];

    await transporter.sendMail({
        from:       `"Открытая Математика" <from@omath.net>`,
        to:         letter.to,
        subject:    `${cEmoji} ` + letter.subject,
        html:       letter.body,
    });
}

//
//
//

async function createFakeLetter(letter: Letter)
{
    await fs.promises.mkdir('.mail', { recursive: true });
    await fs.promises.writeFile('.mail/' + letter.to + '-' + Date.now(), JSON.stringify(letter, null, 4));
}