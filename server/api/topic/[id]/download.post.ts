import { globSync } from "glob";
import JSZip from "jszip";
import YAML from "yaml";

import fs from "fs";
import path from "path";

import getDb from "~/server/db";
import Topic from "~/server/db/entity/Topic";
import { assetPath } from "~/server/utils/asset";
import getLoggedUserId from "~/server/utils/ensureLogged";
import { getTopicIdFromParam } from "~/server/utils/topic";

export default defineEventHandler(async event =>
{
    const topicId = getTopicIdFromParam(event);

    if (!topicId)
        return createError('Некорректный идентификатор темы!');

    const userId = await getLoggedUserId(event, false);

    if (!(await canSeeTopic(topicId, userId)))
        return setResponseStatus(event, 403);

    //

    const db = await getDb();
    const dbTopic = await db.manager.findOneBy(Topic, { id: topicId });

    if (!dbTopic)
        return;

    //

    return await getZipBlob(dbTopic);
});

async function getZipBlob(topic: Topic)
{
    const zip = new JSZip;

    // Topic parts

    ['article', 'summary', 'practicum'].forEach(topicPart => {
        if (topic[topicPart])
            zip.file(topicPart + '.md', topic[topicPart]);
    });

    // Topic info

    let topicInfo = {};

    if (topic.title)
        topicInfo['title'] = topic.title;

    if (topic.desc)
        topicInfo['desc'] = topic.desc;

    if (topic.tags)
        topicInfo['keywords'] = topic.tags.split('\n').map(keyword => keyword.trim());

    if (topic.contributors)
        topicInfo['contributors'] = topic.contributors.split('\n').map(contributor => contributor.trim());

    if (Object.keys(topicInfo).length > 0)
        zip.file('topic.yml', YAML.stringify(topicInfo));

    // Topic assets

    const rawPaths = globSync(assetPath(topic.id, '**/*'), { nodir: true });

    for (let rawPath of rawPaths)
    {
        rawPath = rawPath.split(path.sep).join('/');
        zip.file(rawPath.replace(assetPath(topic.id), 'assets'), fs.readFileSync(rawPath));
    }

    //

    return await zip.generateAsync({ type: 'blob' });;
}