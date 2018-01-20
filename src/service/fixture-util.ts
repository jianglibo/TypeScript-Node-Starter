import * as path from "path";
import {
  ListBody,
  AttributesBase,
  JsonapiObject,
  PageOffsetLimit
} from "data-shape-ng";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { FilterPhrase } from "data-shape-ng";

const CHANGING_FIXTURES_DIR = path.join(process.cwd(), "changingfixtures");
const SRC_FIXTURE_DIR = path.join(process.cwd(), "src", "fixtures");

if (!existsSync(CHANGING_FIXTURES_DIR)) {
  mkdirSync(CHANGING_FIXTURES_DIR);
}

export function getFixtureFilePath(nameInUrl: string): string {
  const dp = path.join(CHANGING_FIXTURES_DIR, nameInUrl + ".json");
  if (!existsSync(dp)) {
    writeFileSync(
      dp,
      readFileSync(path.join(SRC_FIXTURE_DIR, nameInUrl + ".json"))
    );
  }
  return dp;
}

export let project_root = path.join(__dirname, "..");

export function from_project_root(...paths: string[]): string {
  return path.join(project_root, ...paths);
}

function findNextLargestId<
  E extends AttributesBase,
  T extends JsonapiObject<E>
>(lb: ListBody<E, T>): string {
  let lag = 0;
  const nullItems: number[] = [];
  for (let index = 0; index < lb.data.length; index++) {
    const element = lb.data[index];
    if (!element) {
      nullItems.push(index);
      continue;
    }
    if (+element.id > lag) {
      lag = +element.id;
    }
  }
  if (nullItems.length > 0) {
    lb.data = lb.data.filter((v, i) => {
      return nullItems.indexOf(i) === -1;
    });
  }
  return (lag + 1).toString();
}

export function getListContent<
  E extends AttributesBase,
  T extends JsonapiObject<E>
>(
  nameInUrl: string,
  page?: PageOffsetLimit,
  filters?: FilterPhrase[]
): ListBody<E, T> {
  let jo: string;
  jo = readFileSync(getFixtureFilePath(nameInUrl)).toString();
  const lb = JSON.parse(jo) as ListBody<E, T>;
  const tl = lb.data.length;
  console.log(filters);
  console.log(page);
  // correct meta data in case of wrong.
  if (tl !== lb.meta.totalResourceCount) {
    lb.meta.totalResourceCount = tl;
    const p = getFixtureFilePath(nameInUrl);
    writeFileSync(p, JSON.stringify(lb), { encoding: "utf-8" });
  }

  if (filters && filters.length > 0) {
    console.log(filters);
    const value = filters[0].value;
    const fname = filters[0].fname;
    const afterFilterData = lb.data.filter(v => {
      const av = v.attributes[fname] as string;
      if (av) {
        return av.indexOf(value) !== -1;
      } else {
        return false;
      }
    });
    lb.data = afterFilterData;
    lb.meta.totalResourceCount = afterFilterData.length;
  }
  if (page) {
    let start = page.offset;
    let end = page.offset + page.limit;
    start = start < tl ? start : tl;
    end = end < tl ? end : tl;
    const section = lb.data.slice(start, end);
    lb.data = section;
  }

  return lb;
}

export function addItem<E extends AttributesBase, T extends JsonapiObject<E>>(
  nameInUrl: string,
  item: T
): void {
  const jo = readFileSync(getFixtureFilePath(nameInUrl)).toString();
  const lb = JSON.parse(jo) as ListBody<E, T>;
  if (!item.id) {
    item.id = findNextLargestId(lb);
  }
  lb.data.push(item);
  lb.meta.totalResourceCount += 1;
  writeFileSync(getFixtureFilePath(nameInUrl), JSON.stringify(lb), {
    encoding: "utf-8"
  });
}
