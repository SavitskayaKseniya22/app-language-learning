import * as module from "node:module";
import { resolve, load } from "./typescript-loader.mjs";

if (typeof module.registerHooks === "function") {
    module.registerHooks({ resolve, load });
} else {
    // Node 20 supports register(), but does not expose registerHooks().
    module.register(new URL("./typescript-loader.mjs", import.meta.url), import.meta.url);
}
