import { supabase } from "@/shared/api/supabase/config";
import type { Database } from "@/shared/api/supabase/database.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

function isItToday(date: string) {
    return new Date(date).toDateString() === new Date().toDateString();
}

function sortPreData(preData: StatisticsType): StatisticsType {
    return Object.fromEntries(
        Object.entries(preData).map(([game, results]) => [
            game,
            results.filter(result => isItToday(result.date_created)),
        ]),
    );
}

export enum GameType {
    audiocall = "audiocall",
    constructor = "constructor",
    puzzles = "puzzles",
    sprint = "sprint",
}

type GameResultType = Database["public"]["Tables"]["results"]["Row"];

export type NewResultType = Database["public"]["Tables"]["results"]["Insert"];

export type ProfileType = Database["public"]["Tables"]["profiles"]["Row"];

export type StatisticsType = Record<string, GameResultType[]>;

type UserResultsType = {
    total: StatisticsType;
    today: StatisticsType;
};

export function getSum(array: number[]) {
    return array.reduce((sum, value) => sum + value, 0);
}

export function reduceData(data: StatisticsType, type: GameType) {
    const results = data[type];

    const times = results.map(item => item.time).filter((time): time is number => time !== null);

    return {
        score: getSum(results.map(item => item.score)),

        played: results.length,

        accuracy:
            results.length > 0 ? +(getSum(results.map(item => item.accuracy)) / results.length).toFixed(3) : undefined,

        learned:
            type !== GameType.puzzles && results.length > 0
                ? getSum(results.map(item => item.learned ?? 0))
                : undefined,

        encountered:
            type !== GameType.puzzles && results.length > 0
                ? getSum(results.map(item => item.encountered ?? 0))
                : undefined,

        time:
            (type === GameType.puzzles || type === GameType.constructor) && times.length > 0
                ? Math.min(...times)
                : undefined,
    };
}

export function refineData(preData: StatisticsType) {
    const games = [GameType.puzzles, GameType.constructor, GameType.audiocall, GameType.sprint];

    const refined = Object.fromEntries(games.map(game => [game, reduceData(preData, game)]));

    const total = {
        score: 0,
        played: 0,
        learned: 0,
        encountered: 0,
        accuracy: 0,
        time: undefined,
    };

    let accuracyCount = 0;

    for (const item of Object.values(refined)) {
        total.score += item.score;
        total.played += item.played;
        total.learned += item.learned ?? 0;
        total.encountered += item.encountered ?? 0;

        if (item.accuracy !== undefined) {
            total.accuracy += item.accuracy;
            accuracyCount++;
        }
    }

    if (accuracyCount) {
        total.accuracy = +(total.accuracy / accuracyCount).toFixed(3);
    }

    return {
        ...refined,
        total,
    };
}

export type Word = Database["public"]["Tables"]["words"]["Row"];

type GetWordsResponse = {
    words: Word[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

type GetWordsArguments = {
    difficulty: number;
    page: number;
    pageSize?: number;
};

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "",
    }),
    tagTypes: ["Words"],
    endpoints: builder => ({
        getUserResults: builder.query<UserResultsType, void>({
            async queryFn() {
                try {
                    const { data, error } = await supabase
                        .from("results")
                        .select("*")
                        .order("date_created", { ascending: false });

                    if (error) {
                        throw error;
                    }

                    const extractedData: StatisticsType = {
                        [GameType.sprint]: [],
                        [GameType.audiocall]: [],
                        [GameType.constructor]: [],
                        [GameType.puzzles]: [],
                    };

                    for (const result of data) {
                        extractedData[result.game_name].push(result);
                    }

                    return {
                        data: {
                            today: sortPreData(extractedData),
                            total: extractedData,
                        },
                    };
                } catch (error) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR",
                            error: error instanceof Error ? error.message : "Failed to get user results",
                        },
                    };
                }
            },
        }),
        getWordsByDifficulty: builder.query<GetWordsResponse, GetWordsArguments>({
            async queryFn({ difficulty, page, pageSize = 20 }) {
                try {
                    const from = (page - 1) * pageSize;
                    const to = from + pageSize - 1;

                    const { data, error, count } = await supabase
                        .from("words")
                        .select("*", { count: "exact" })
                        .eq("difficulty", difficulty)
                        .order("id", { ascending: true })
                        .range(from, to);

                    if (error) {
                        return {
                            error: {
                                status: "CUSTOM_ERROR",
                                error: error.message,
                            },
                        };
                    }

                    const total = count ?? 0;

                    return {
                        data: {
                            words: data ?? [],
                            total,
                            page,
                            pageSize,
                            totalPages: Math.ceil(total / pageSize),
                        },
                    };
                } catch (error) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR",
                            error: error instanceof Error ? error.message : "Unknown error",
                        },
                    };
                }
            },

            providesTags: ["Words"],
        }),
    }),
});

export const { useGetUserResultsQuery, useGetWordsByDifficultyQuery } = userApi;
