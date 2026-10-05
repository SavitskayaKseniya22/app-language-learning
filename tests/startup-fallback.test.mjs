import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const startupScript = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(startupScript, "The startup fallback must run independently of the application bundle");

function createPage(readyState = "complete") {
    const panels = {
        "startup-loading": { hidden: false },
        "startup-error": { hidden: true },
    };
    const events = {};
    class HTMLScriptElement {}
    runInNewContext(startupScript, {
        HTMLScriptElement,
        window: {
            addEventListener: (name, callback) => {
                events[name] = callback;
            },
        },
        document: {
            readyState,
            getElementById: id => panels[id],
            addEventListener: (name, callback) => {
                events[name] = callback;
            },
        },
    });
    return { panels, events, HTMLScriptElement };
}

test("A failed application script replaces loading with a visible error", () => {
    const { panels, events, HTMLScriptElement } = createPage();
    events.error({ target: new HTMLScriptElement() });
    assert.equal(panels["startup-loading"].hidden, true);
    assert.equal(panels["startup-error"].hidden, false);
});

test("Early script failures wait until the fallback DOM is available", () => {
    const { panels, events, HTMLScriptElement } = createPage("loading");
    events.error({ target: new HTMLScriptElement() });
    assert.equal(panels["startup-error"].hidden, true);
    events.DOMContentLoaded();
    assert.equal(panels["startup-error"].hidden, false);
});

test("An unrelated resource error does not show an application startup failure", () => {
    const { panels, events } = createPage();
    events.error({ target: {} });
    assert.equal(panels["startup-error"].hidden, true);
});
