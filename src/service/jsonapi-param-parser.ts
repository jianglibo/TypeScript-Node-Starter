import { PageOffsetLimit, FilterPhrase } from 'data-shape-ng';
// page[offset]=0&page[limit]=5&sort=&filter[]=

export class JsonapiParamParser {
    static  offsetLimit(url: string): PageOffsetLimit {
        const PAGE_OFFSET_PTN = /page\[offset\]=(\d+)/i;
        const PAGE_LIMIT_PTN = /page\[limit\]=(\d+)/i;

        const pol = {offset: 0, limit: 10};
        let m = PAGE_OFFSET_PTN.exec(url);
        if (m) {
            pol.offset = +(m[1]);
        }
        m = PAGE_LIMIT_PTN.exec(url);
        if (m) {
            pol.limit = +(m[1]);
        }
        return pol;
    }

    static  filters(url: string): FilterPhrase[] {
        // const FILTER_PHRASE_PTN = /filter\[(^[=]*)\]=(^[&]*)/i;
        const FILTER_PHRASE_PTN = /filter\[([^=]*)\]=([^&]*)/i;
        const fps = [];
        let m = undefined;
        while (m = FILTER_PHRASE_PTN.exec(url)) {
            fps.push({fname: m[1], value: m[2]});
        }
        return fps;
    }
}