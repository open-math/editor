export class UniqueListItem
{
    topicPart:  string;
    type:       string;
    id:         string;
    title?:     string;
}

export class UniquesGrouped
{
    article:    UniqueListItem[];
    summary:    UniqueListItem[];
    practicum:  UniqueListItem[];
}

class Unique
{
    map = {};

    get(uniqueId: string)
    {
        return this.map[uniqueId];
    }

    getGroupedList(): UniquesGrouped | undefined
    {
        let groups = {
            article:    [],
            summary:    [],
            practicum:  [],
        }

        Object.keys(this.map).forEach(uniqueId =>
        {
            let locationParts = uniqueId.slice(1).split('|');
            let idParts = locationParts[2].split(':');

            let li = new UniqueListItem;
                li.topicPart =  locationParts[0];
                li.type =       idParts[0];
                li.id =         idParts[1];

            let content = this.map[uniqueId];
            li.title = content[0]?.title;

            groups[li.topicPart].push(li);
        });

        Object.keys(groups).forEach(key => {
            if (groups[key].length === 0)
                delete groups[key];
        });

        if (Object.keys(groups).length === 0)
            return;

        return groups;
    }

    set(topicPart: string, uniques: any[])
    {
        Object.keys(this.map).forEach(uniqueId =>
        {
            if (uniqueId.startsWith('@' + topicPart))
                delete this.map[uniqueId];
        });

        uniques.forEach(unique => this.map[unique.id] = unique.content);
    }
}

export const UNIQUE = new Unique;