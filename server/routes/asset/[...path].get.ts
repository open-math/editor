import fs from "fs";
import path from "path";
import mime from "mime";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const assetPath = decodeURI(event.context.params?.path ?? '');

    if (!assetPath)
        return setResponseStatus(event, 403);

    const filePath = path.join(config.public.assetsRoot, assetPath);

    event.node.res.setHeader('Content-type', mime.getType(assetPath) ?? '');

    return sendStream(event, fs.createReadStream(filePath));
});