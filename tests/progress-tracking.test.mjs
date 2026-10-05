import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import ProgressTracking from "../src/shared/ui/progress-tracking/progress-tracking.tsx";

function render(t, properties) {
    const dom = new JSDOM(renderToStaticMarkup(createElement(ProgressTracking, properties)));
    t.after(() => dom.window.close());
    return dom.window.document;
}

test("Game progress keeps one segment per word and fills completed segments", t => {
    const words = [{ id: 1 }, { id: 2 }, { id: 3 }];
    for (const streak of [0, 1, 3]) {
        const document = render(t, { words, streak });
        assert.equal(document.querySelectorAll("li").length, 3);
        assert.equal(document.querySelectorAll(".progress__item--filled").length, streak);
        assert.equal(document.querySelector(".progress__info").textContent, `${streak} из 3`);
        assert.equal(document.querySelector('[role="progressbar"]').getAttribute("aria-valuenow"), String(streak));
    }
});

test("Profile progress uses the total count without rendering thousands of words", t => {
    const document = render(t, { total: 3600, streak: 900, label: "Выученные слова" });
    assert.equal(document.querySelectorAll("li").length, 2);
    assert.equal(document.querySelector(".progress__item--filled").style.flexBasis, "25%");
    assert.equal(document.querySelector('[role="progressbar"]').getAttribute("aria-label"), "Выученные слова");
    assert.equal(document.querySelector(".progress__info").textContent, "900 из 3600");
});

test("Empty and complete progress have finite widths and valid accessible values", t => {
    for (const [total, streak, width] of [
        [0, 0, "0%"],
        [10, 10, "100%"],
        [10, 20, "100%"],
        [10, -1, "0%"],
    ]) {
        const document = render(t, { total, streak });
        const progress = document.querySelector('[role="progressbar"]');
        assert.equal(document.querySelector(".progress__item--filled").style.flexBasis, width);
        assert.ok(Number(progress.getAttribute("aria-valuenow")) <= Number(progress.getAttribute("aria-valuemax")));
    }
    assert.equal(render(t, { words: [], streak: 0 }).querySelectorAll("li").length, 0);
});
