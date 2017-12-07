import * as path from "path";


export let project_root = path.join(__dirname, "..");

export function from_project_root(...paths: string[]): string {
    return path.join(project_root, ...paths);
}