import type { UniquesGrouped } from "./unique";
import type { Asset } from "~/server/utils/asset";

export class Dimensions
{
    width: number;
    height: number;
}

//

export enum RequestType
{
    Init,
    Render,
}

export interface IRequestBaseData
{
    topicId:    number;
    macros:     object;
    assets:     Asset[];
}

export abstract class Request implements IRequestBaseData
{
    abstract type: RequestType;
    topicId:    number;
    macros:     object = {};
    assets:     Asset[] = [];
}

export class InitRequest extends Request
{
    type =      RequestType.Init;
    article:    string;
    summary:    string;
    practicum:  string;
}

export class RenderRequest extends Request
{
    type =      RequestType.Render;
    topicPart:  string;
    content:    string;
}

export type TResponseLike = 'translator-ready' | Response;

export class Response
{
    topicPart: string;
    rendered: {
        content: string;
        uniques: { [id:string]: string }
    };
    uniques?: UniquesGrouped;
}