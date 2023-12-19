import { Helper, Location } from "translator/browser";
import type { Dimensions, Request } from "./io";
import { UNIQUE } from "./unique";

export class TranslatorHelper extends Helper
{
    request: Request;

    isEditor() { return true; }

    async hasAsset(location: Location): Promise<boolean>
    {
        let assetPath = location.target.replace('assets/', '');
        return this.request.assets.filter(asset => asset.path === assetPath).length > 0;
    }

    async getAssetSrc(location: Location): Promise<string>
    {
        let assetPath = location.target.replace('assets/', '');
        return `/asset/${this.request.topicId}/${assetPath}`;
    }

    async getImageSize(location: Location): Promise<{ width: number; height: number; }>
    {
        let assetPath = location.target.replace('assets/', '');
        let asset = this.request.assets.filter(_asset => _asset.path === assetPath)[0];

        return asset.meta?.dimensions as Dimensions;
    }

    getMathMacros(): object
    {
        return this.request.macros;
    }

    async getUnique(id: string)
    {
        return UNIQUE.get(id);
    }

    i18n(phrase: string): string
    {
        // Include phrases in "translator" package
        let phraseMap = {
            error: 'Error!',
            anchor: 'Link to this section',
            accentBlock:
            {
                important: { name: 'Important' },
                example:
                {
                    name: 'Example',
                    expand: 'Solution'
                },
                definition: { name: 'Definition' },
                theorem:
                {
                    name: 'Theorem',
                    expand: 'Proof'
                }
            },
            task:
            {
                hint:       'Hint',
                answer:     'Answer',
                note:       'Note',
                solution:   'Solution',
                similar:    'Similar tasks',
                similarNum: 'Similar task',
                generate:   'Generate similar task',
            }
        };

        let cursor = phraseMap;
        let phraseParts = phrase.split('.');
        let result = phrase;

        for (let i = 0; i < phraseParts.length; i++)
        {
            try
            {
                let value = cursor[phraseParts[i]];
                cursor = value;

                if (i === phraseParts.length - 1)
                    if (typeof value === 'string')
                        result = value;
            } catch { break; }
        }

        return result;
    }
}