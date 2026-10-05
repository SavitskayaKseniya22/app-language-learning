import { test } from "node:test";
import assert from "node:assert/strict";
import { configureStore } from "@reduxjs/toolkit";
import puzzleReducer, { updateMiddlePuzzleState, resetPuzzleState } from "../src/pages/sentences/model/puzzle-slice.ts";
import sprintReducer, { updateSpritState } from "../src/pages/sprint/model/sprint-slice.ts";
import { DataQueue as AudiocallQueue } from "../src/pages/audiocall/model/audiocall-data-queue.ts";
import { DataQueue as PuzzleQueue } from "../src/pages/sentences/model/puzzle-data-queue.ts";

const word = { id: 1, word: "hello", text_example: "Hello world" };

test("Puzzle answers are scored before Next or timer completion", () => {
    const store = configureStore({ reducer: puzzleReducer });
    store.dispatch(updateMiddlePuzzleState({ middleResult: true }));
    assert.equal(store.getState().puzzle.correct, 1);
    assert.equal(store.getState().puzzle.score, store.getState().puzzle.points);
});

test("Puzzle verdicts count once per round and reset for the next sentence", () => {
    const store = configureStore({ reducer: puzzleReducer });
    store.dispatch(updateMiddlePuzzleState({ middleResult: true }));
    store.dispatch(updateMiddlePuzzleState({ middleResult: false }));
    assert.equal(store.getState().puzzle.correct, 1);
    assert.equal(store.getState().puzzle.wrong, 0);
    store.dispatch(updateMiddlePuzzleState({ middleResult: null }));
    store.dispatch(updateMiddlePuzzleState({ middleResult: false }));
    assert.equal(store.getState().puzzle.wrong, 1);
    store.dispatch(resetPuzzleState());
    assert.equal(store.getState().puzzle.correct, 0);
    assert.equal(store.getState().puzzle.middleResult, null);
});

test("Puzzle penalties never produce a negative score", () => {
    const store = configureStore({ reducer: puzzleReducer });
    store.dispatch(updateMiddlePuzzleState({ middleResult: false }));
    assert.equal(store.getState().puzzle.score, 0);
});

test("A final Sprint answer is present in the synchronous save snapshot", () => {
    const store = configureStore({ reducer: sprintReducer });
    store.dispatch(updateSpritState({ isAnswerCorrect: true, word }));
    const saved = store.getState().sprint;
    assert.equal(saved.answers.correct.length, 1);
    assert.equal(saved.score, 10);
});

test("Audiocall supports small sets without undefined answer options", () => {
    for (let count = 1; count <= 6; count++) {
        const words = Array.from({ length: count }, (_, index) => ({ ...word, id: index + 1 }));
        const queue = new AudiocallQueue({ elements: words });
        for (let round = 0; round < count; round++) {
            assert.equal(queue.words.others.length, Math.min(count, 5));
            assert.ok(queue.words.others.every(Boolean));
            assert.ok(queue.words.others.some(option => option.id === queue.words.ref.id));
            if (!queue.isEmpty) queue.nextFive();
        }
        assert.equal(queue.isEmpty, true);
    }
});

test("Short puzzle sentences terminate and preserve every word at each complexity", { timeout: 1000 }, () => {
    for (const complexity of [undefined, 0, 1, 2, 3, 4]) {
        for (const sentence of ["Hi", "Hello world", "", "This is a longer sentence to practice"]) {
            const queue = new PuzzleQueue({ elements: [{ ...word, text_example: sentence }], complexity });
            const orderedParts = queue.divideSentence({ sentence });
            assert.equal(orderedParts.join(" "), sentence);
            assert.ok(queue.word.dnd.source.length > 0);
        }
    }
});
