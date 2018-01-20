import {} from 'jest';
import { readFileSync, readdirSync } from 'fs';

describe("get the fixture contents.", () => {
  it("current dir should be right.", () => {
    const cwd = process.cwd();
    const dfs = readdirSync(cwd);
    expect(dfs.length).toBe(22);
    const dfsSet = new Set(dfs);
    expect(dfsSet.has(".env.example")).toBeTruthy();
  });
});
