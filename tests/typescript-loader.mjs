import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));

export function resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
        specifier = pathToFileURL(path.join(root, "src", specifier.slice(2))).href;
    }
    if (specifier.startsWith(".") || specifier.startsWith("file:")) {
        const url = new URL(specifier, context.parentURL);
        if (!path.extname(url.pathname)) {
            for (const extension of [".ts", ".tsx", "/index.ts", "/index.tsx"]) {
                const candidate = `${url.href}${extension}`;
                if (existsSync(fileURLToPath(candidate))) return nextResolve(candidate, context);
            }
        }
    }
    return nextResolve(specifier, context);
}

export function load(url, context, nextLoad) {
    if (url.endsWith(".module.scss")) {
        // DOM tests use class names; stylesheet compilation is checked by the build.
        return {
            format: "module",
            source: "export default new Proxy({}, { get: (_, name) => name });",
            shortCircuit: true,
        };
    }
    if (/\.tsx?$/.test(url)) {
        const source = readFileSync(fileURLToPath(url), "utf8");
        return {
            format: "module",
            source: ts.transpileModule(source, {
                compilerOptions: {
                    module: ts.ModuleKind.ESNext,
                    target: ts.ScriptTarget.ES2022,
                    jsx: ts.JsxEmit.ReactJSX,
                },
            }).outputText,
            shortCircuit: true,
        };
    }
    return nextLoad(url, context);
}
