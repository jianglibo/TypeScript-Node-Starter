import { PageOffsetLimit } from 'data-shape-ng';
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
}