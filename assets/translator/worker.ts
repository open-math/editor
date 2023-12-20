import chalk from "chalk";

import { Location, LocationType, ParseResult, Parser, Renderer } from "translator/browser";

import { UNIQUE } from "./unique";
import { TranslatorHelper } from "./helper";
import { Response, Request, RequestType, InitRequest, RenderRequest, type TResponseLike } from "./io";

//
//
//

let inited = false;
let renderId = 0;

onmessage = async e =>
{
    let request = e.data as Request;
    let response: TResponseLike | undefined;

    switch (request.type)
    {
        case RequestType.Init:
            await init(request as InitRequest);
            response = 'translator-ready';
            break;
        case RequestType.Render:
            response = await render(request as RenderRequest);
            break;
    }

    if (response)
        postMessage(response);
}

//
// Init
//

async function init(request: InitRequest)
{
    console.log(chalk.gray('Translator worker [re]initialization!'));

    inited = false;
    UNIQUE.map = {};
    UNIQUE.renderedMap = {};

    let helper = getHelper(request);

    for (let topicPart of ['article', 'summary', 'practicum'])
    {
        let location =      getLocation(topicPart);
        let parser =        new Parser(location, helper);
        let parseResult: ParseResult;

        try {
            parseResult =   await parser.parse(request[topicPart]);

            parseResult.errors.forEach(parseError => {
                console.warn('Translator worker init parse error!');
                console.error(parseError);
            });
        }
        catch (e) {
            console.warn('Translator worker init error!');
            console.error(e);
        }

        UNIQUE.set(topicPart, parseResult!.uniques ?? []);
    }

    inited = true;

    console.log(chalk.green(`Transator worker ready with ${Object.keys(UNIQUE.map).length} uniques!`));
}

//
// Render
//

async function render(request: RenderRequest)
{
    if (!inited)
    {
        console.warn('Render request during translator worker initialization! Rejected!');
        return;
    }

    const cRenderId = ++renderId;

    let location =  getLocation(request.topicPart);
    let helper =    getHelper(request);

    let parser =    new Parser(location, helper);
    let renderer =  new Renderer(location, helper);

    renderer.onRenderError = (product, error) => {
        console.warn('Translator worker render error!');
        console.error(product);
        console.error(error);
    }

    let parseResult = await parser.parse(request.content);
    UNIQUE.set(request.topicPart, parseResult.uniques);

    for (let unique of parseResult.uniques)
    {
        if (unique.content)
            UNIQUE.renderedMap[unique.id] = await renderer.renderBlocks(unique.content);
    }

    let response = new Response;
        response.topicPart = request.topicPart;
        response.rendered = {
            content: await renderer.renderBlocks(parseResult.blocks),
            uniques: {},
        };

    for (let uniqueId of Object.keys(UNIQUE.map))
    {
        let uniqueContent = UNIQUE.map[uniqueId];
        if (uniqueContent)
            response.rendered.uniques[uniqueId] = UNIQUE.renderedMap[uniqueId] ?? await renderer.renderBlocks(uniqueContent);
    }

    response.uniques = UNIQUE.getGroupedList();

    if (cRenderId === renderId)
        return response;
}

//
// Utils
//

function getLocation(topicPart: string)
{
    let location = new Location;
        location.type = topicPart as LocationType;
        location.path = 'editor';

    return location;
}

function getHelper(request: Request)
{
    let helper = new TranslatorHelper;
        helper.request = request;

    return helper;
}