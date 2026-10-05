import type { GameResultType } from "@/entities/user/api/user-api";

export function localDay(date: string | Date) {
    const value = new Date(date);
    return `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`;
}

export function summarizeGames(games: GameResultType[]) {
    let score = 0;
    let best = 0;
    let accuracy = 0;
    let newWords = 0;
    let learnedWords = 0;
    for (const game of games) {
        score += game.score;
        best = Math.max(best, game.score);
        accuracy += game.accuracy;
        newWords += game.new_words;
        learnedWords += game.learned_words;
    }
    return {
        count: games.length,
        score,
        best,
        accuracy: games.length > 0 ? Math.round(accuracy / games.length) : null,
        newWords,
        learnedWords,
    };
}

export function getActivityStreak(games: GameResultType[], now = new Date()) {
    const days = new Set(games.map(game => localDay(game.created_at)));
    const cursor = new Date(now);
    if (!days.has(localDay(cursor))) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (days.has(localDay(cursor))) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}
