/// <reference path="../typings/tsd.d.ts" />
/// <reference path="material-ui.d.ts" />

interface NodeRequireFunction {
    (id: string): any;
    (paths: string[], callback: (...modules: any[]) => void): void;
}

interface NodeRequire extends NodeRequireFunction {
    resolve(id:string): string;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
}

declare var require: NodeRequire;
