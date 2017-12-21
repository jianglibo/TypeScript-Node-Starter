import {} from 'jest';
import { Manufacturer, ManufacturerAttributes } from 'data-shape-ng';
import { JsonapiParamParser } from '../../src/service/jsonapi-param-parser';

describe("should parse jsonapi url.", () => {
  it("should be correct regex.", () => {
    const r = /page\[offset\]=(\d+)/i;
    const r1 = /page\[limit\]=(\d+)/i;
    expect(r.flags).toBe('i');

    let match: RegExpExecArray;
    match = r.exec("page[offset]=0&page[limit]=5&sort=&filter[]=");
    expect(match[1]).toBe('0');
    match = r.exec("page[offset]=2&page[limit]=5&sort=&filter[]=");
    expect(match[1]).toBe('2');
    match = r1.exec("page[offset]=2&page[limit]=5&sort=&filter[]=");
    expect(match[1]).toBe('5');
  });

  it("should return PageOffsetLimit.", () => {
    const pol =  JsonapiParamParser.offsetLimit("page[offset]=0&page[limit]=5&sort=&filter[]=");
    expect(pol.offset).toBe(0);
    expect(pol.limit).toBe(5);
  });
});

/*
 * The following method call captures groups while matching regex against str:

var matchData = regex.exec(str);
If there was no match, matchData is null. Otherwise, matchData is a match result, an array with two additional properties:

Array elements
Element 0 is the match for the complete regular expression (group 0, if you will).
Element n > 1 is the capture of group n.
Properties
input is the complete input string.
index is the index where the match was found.
First Match (Flag /g Not Set)
If the flag /g is not set, only the first match is returned:

> var regex = /a(b+)/;
> regex.exec('_abbb_ab_')
[ 'abbb',
  'bbb',
  index: 1,
  input: '_abbb_ab_' ]
> regex.lastIndex
0
All Matches (Flag /g Set)
If the flag /g is set, all matches are returned if you invoke exec() repeatedly. The return value null signals that there are no more matches. The property lastIndex indicates where matching will continue next time:

> var regex = /a(b+)/g;
> var str = '_abbb_ab_';

> regex.exec(str)
[ 'abbb',
  'bbb',
  index: 1,
  input: '_abbb_ab_' ]
> regex.lastIndex
6

> regex.exec(str)
[ 'ab',
  'b',
  index: 7,
  input: '_abbb_ab_' ]
> regex.lastIndex
10

> regex.exec(str)
null
Here we loop over matches:

var regex = /a(b+)/g;
var str = '_abbb_ab_';
var match;
while (match = regex.exec(str)) {
    console.log(match[1]);
}
and we get the following output:

bbb
b
 */