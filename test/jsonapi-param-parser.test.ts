import {} from 'jest';
import { FilterPhrase } from 'data-shape-ng';
import { JsonapiParamParser } from '../src/service/jsonapi-param-parser';

describe("should parse parameter correctly.", () => {
  it("should parse one filter.", () => {
    let url = "/abc/?filter[a]=b";
    let fp = JsonapiParamParser.oneFilter(url);
    expect(fp.fname).toBe('a');
    expect(fp.value).toBe('b');

    url = "/abc/?filter[a]=b&c=d";
    fp = JsonapiParamParser.oneFilter(url);
    expect(fp.fname).toBe('a');
    expect(fp.value).toBe('b');

    url = "/abc/?filter[a]=b&filter[c]=d";
    fp = JsonapiParamParser.oneFilter(url);
    expect(fp.fname).toBe('a');
    expect(fp.value).toBe('b');

    url = "/abc/?filter[a]=";
    fp = JsonapiParamParser.oneFilter(url);
    expect(fp.fname).toBe('a');
    expect(fp.value).toBe('');

    url = "/abc/?filter[a]=&";
    fp = JsonapiParamParser.oneFilter(url);
    expect(fp.fname).toBe('a');
    expect(fp.value).toBe('');
  });
});
