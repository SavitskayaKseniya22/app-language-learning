import { test } from "node:test";
import assert from "node:assert/strict";
import { localDay, summarizeGames, getActivityStreak } from "../src/pages/profile/model/statistics.ts";

const game = (date, overrides = {}) => ({
    id: 1,
    user_id: "user",
    created_at: date.toISOString(),
    game_name: "sprint",
    score: 10,
    accuracy: 80,
    new_words: 2,
    learned_words: 1,
    ...overrides,
});

test("Profile totals distinguish average game accuracy from answer accuracy", () => {
    const games = [
        game(new Date(), { score: 20, accuracy: 100 }),
        game(new Date(), { score: 5, accuracy: 50, new_words: 0, learned_words: 0 }),
    ];
    assert.deepEqual(summarizeGames(games), {
        count: 2,
        score: 25,
        best: 20,
        accuracy: 75,
        newWords: 2,
        learnedWords: 1,
    });
    assert.equal(summarizeGames(Array.from({ length: 1501 }, () => games[0])).count, 1501);
});

test("An empty profile has no accuracy instead of claiming zero percent", () => {
    assert.deepEqual(summarizeGames([]), { count: 0, score: 0, best: 0, accuracy: null, newWords: 0, learnedWords: 0 });
    assert.equal(getActivityStreak([]), 0);
});

test("Today follows the user's local calendar at midnight", () => {
    const midnight = new Date(2026, 9, 5);
    assert.equal(localDay(midnight.toISOString()), "2026-10-5");
    assert.equal(localDay(new Date(midnight.getTime() - 1)), "2026-10-4");
});

test("Activity streak counts calendar days, skips duplicate games and accepts yesterday", () => {
    const now = new Date(2026, 9, 5, 12);
    const games = [game(new Date(2026, 9, 4, 23)), game(new Date(2026, 9, 4, 10)), game(new Date(2026, 9, 3, 9))];
    assert.equal(getActivityStreak(games, now), 2);
    assert.equal(getActivityStreak([...games, game(now)], now), 3);
    assert.equal(getActivityStreak([game(new Date(2026, 9, 3))], now), 0);
    assert.equal(getActivityStreak([game(now), game(new Date(2026, 9, 3))], now), 1);
});

test("Activity streak crosses month and year boundaries", () => {
    const now = new Date(2027, 0, 1, 12);
    assert.equal(getActivityStreak([game(now), game(new Date(2026, 11, 31)), game(new Date(2026, 11, 30))], now), 3);
});
