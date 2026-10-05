import { test } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { createElement, act } from "react";
import { createRoot } from "react-dom/client";
import Input from "../src/shared/ui/input/input.tsx";
import CustomSelect from "../src/shared/ui/select/select.tsx";
import CustomTable from "../src/shared/ui/table/table.tsx";
import { useGameFinish } from "../src/entities/game/model/use-game-finish.ts";

async function mount(t, element) {
    const dom = new JSDOM("<!doctype html><html><body><div id='test-root'></div></body></html>");
    const globals = {
        window: dom.window,
        document: dom.window.document,
        HTMLElement: dom.window.HTMLElement,
        getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
        IS_REACT_ACT_ENVIRONMENT: true,
    };
    const previous = new Map();
    for (const [key, value] of Object.entries(globals)) {
        previous.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
        Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
    }
    const container = dom.window.document.getElementById("test-root");
    const root = createRoot(container);
    t.after(async () => {
        await act(async () => root.unmount());
        dom.window.close();
        for (const [key, descriptor] of previous) {
            if (descriptor) Object.defineProperty(globalThis, key, descriptor);
            else delete globalThis[key];
        }
    });
    await act(async () => root.render(element));
    return container;
}

test("Input labels address distinct fields and clearing does not submit the form", async t => {
    let submits = 0;
    let clears = 0;
    const container = await mount(
        t,
        createElement(
            "form",
            {
                onSubmit: event => {
                    event.preventDefault();
                    submits++;
                },
            },
            createElement(Input, {
                label: "Email",
                defaultValue: "test@example.com",
                isRequired: true,
                clearButtonProps: {
                    onClick: () => {
                        clears++;
                    },
                },
            }),
            createElement(Input, { label: "Password", type: "password" }),
        ),
    );
    const inputs = container.querySelectorAll("input");
    const labels = container.querySelectorAll("label");
    assert.equal(labels[0].control, inputs[0]);
    assert.equal(labels[1].control, inputs[1]);
    assert.notEqual(inputs[0].id, inputs[1].id);
    assert.equal(container.querySelector("label div, label p, label button"), null);
    await act(async () => container.querySelector("button").click());
    assert.equal(clears, 1);
    assert.equal(submits, 0);
});

test("Input preserves an explicit field ID", async t => {
    const container = await mount(t, createElement(Input, { id: "email-field", label: "Email" }));
    assert.equal(container.querySelector("label").control.id, "email-field");
});

test("Select label addresses the rendered combobox", async t => {
    const container = await mount(
        t,
        createElement(CustomSelect, {
            label: "Difficulty",
            inputId: "difficulty-field",
            options: [{ label: "Easy", value: 1 }],
        }),
    );
    assert.equal(container.querySelector("label").control, container.querySelector('[role="combobox"]'));
});

test("CustomTable exposes headers and cells under table rows", async t => {
    const container = await mount(
        t,
        createElement(CustomTable, {
            tableId: "words",
            data: {
                titles: [{ key: "word", title: "Word", widthInGrid: "1fr" }],
                rows: [{ content: { word: "hello" } }],
            },
        }),
    );
    const table = container.querySelector('[role="table"]');
    assert.equal(table.querySelectorAll('[role="row"]').length, 2);
    assert.equal(table.querySelector('[role="columnheader"]').textContent, "Word");
    const cell = table.querySelector('[role="cell"]');
    assert.equal(cell.parentElement.getAttribute("role"), "row");
    assert.equal(cell.textContent, "hello");
});

test("Game completion saves once and keeps answers frozen after success", async t => {
    let state;
    let calls = 0;
    let resolveSave;
    const saved = new Promise(resolve => {
        resolveSave = resolve;
    });
    function Harness() {
        state = useGameFinish(() => {
            calls++;
            return saved;
        });
        return null;
    }
    await mount(t, createElement(Harness));
    await act(async () => {
        state.finish();
        state.finish();
    });
    assert.equal(calls, 1);
    assert.equal(state.ended.current, true);
    assert.equal(state.hasEnded, true);
    assert.equal(state.isSaving, true);
    await act(async () => resolveSave());
    assert.equal(state.isSaving, false);
    assert.equal(state.hasEnded, true);
    await act(async () => state.finish());
    assert.equal(calls, 1);
});

test("A failed save can be retried once while the game stays frozen", async t => {
    let state;
    let calls = 0;
    let resolveRetry;
    const retry = new Promise(resolve => {
        resolveRetry = resolve;
    });
    function Harness() {
        state = useGameFinish(() => {
            calls++;
            return calls === 1 ? Promise.reject(new Error("Offline")) : retry;
        });
        return null;
    }
    await mount(t, createElement(Harness));
    await act(async () => state.finish());
    assert.equal(state.saveFailed, true);
    assert.equal(state.hasEnded, true);
    assert.equal(state.ended.current, true);
    await act(async () => {
        state.finish();
        state.finish();
    });
    assert.equal(calls, 2);
    assert.equal(state.isSaving, true);
    assert.equal(state.saveFailed, false);
    await act(async () => resolveRetry());
    assert.equal(state.isSaving, false);
    assert.equal(state.hasEnded, true);
    await act(async () => state.finish());
    assert.equal(calls, 2);
});
