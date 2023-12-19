import { globSync } from "glob";
import sizeOf from "image-size";

import fs from "fs";
import path from "path";

export function assetPath(topicId: number, relPath?: string)
{
    const config = useRuntimeConfig();
    return config.public.assetsRoot + '/' + topicId + (!relPath ? '' : '/' + relPath);
}

//

export async function canAddAsset(topicId: number)
{
    return (await getState(topicId)).createAllowed;
}

export async function dirExists(topicId: number, dirPath: string)
{
    try
    {
        if (dirPath === '')
            return true;

        return fs.statSync(assetPath(topicId, dirPath)).isDirectory();
    } catch {}

    return false;
}

export async function clearAssets(topicId: number)
{
    try { fs.rmSync(assetPath(topicId), { recursive: true, force: true }); } catch {}
}

export async function removeAsset(topicId: number, path: string)
{
    try { fs.rmSync(assetPath(topicId, path), { recursive: true, force: true }); } catch {}
}

export async function addFolder(topicId: number, path: string, dirName: string)
{
    try { fs.mkdirSync(assetPath(topicId, path + '/' + dirName), { recursive: true }); } catch {}
}

export async function cloneAssets(fromTopicId: number, newTopicId: number)
{
    try { fs.cpSync(assetPath(fromTopicId), assetPath(newTopicId), { recursive: true }); } catch {}
}

//
// State
//

export class AssetMeta
{
    dimensions?: {
        width:  number;
        height: number;
    }
}

export class Asset
{
    path:       string;
    title:      string;
    type:       string;
    directory:  boolean;
    size:       number;
    meta?:      AssetMeta;
}

export class AssetState
{
    totalAssets:    number;
    exceedAssets:   boolean;

    totalSize:      number;
    exceedSize:     boolean;

    createAllowed:  boolean;

    assets:         Asset[];
}

export async function getState(topicId: number): Promise<AssetState>
{
    const config = useRuntimeConfig();
    const state = new AssetState;

    const rawPaths = globSync(assetPath(topicId, '**/*'));
    state.assets = [];
    for (let rawPath of rawPaths)
        state.assets.push(await getAssetFromRawPath(topicId, rawPath));

    state.assets = [
        ...state.assets.filter(asset => asset.directory),
        ...state.assets.filter(asset => !asset.directory),
    ];

    state.totalAssets = rawPaths.length;
    state.exceedAssets = state.totalAssets >= config.public.maxAssets;

    state.totalSize = state.assets.reduce((current, asset) => current + asset.size, 0);
    state.exceedSize = state.totalSize >= config.public.maxTopicTotalSize;

    state.createAllowed = !state.exceedAssets && !state.exceedSize;

    return state;
}

export async function getAssetFromRawPath(topicId: number, rawPath: string): Promise<Asset>
{
    const stat = fs.statSync(rawPath);

    const parsed = path.parse(rawPath);

    const asset = new Asset;
    asset.path =        rawPath.split(path.sep).join('/').replace(assetPath(topicId) + '/', '');
    asset.title =       parsed.name;
    asset.type =        parsed.ext.replace('.', '');
    asset.directory =   stat.isDirectory();
    asset.size =        stat.size / 1024 / 1024;

    try {
        const dimensions = sizeOf(rawPath);
        if (dimensions.width && dimensions.height)
            asset.meta = <AssetMeta>{ dimensions };
    } catch {}

    return asset;
}