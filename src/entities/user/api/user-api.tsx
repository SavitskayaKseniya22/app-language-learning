import { baseApi } from "@/app/api/base-api";
import { supabase } from "@/shared/api";
import type { Database, Tables } from "@/shared/api/supabase/database.types";

export function isItToday(date: string) {
    return new Date(date).toDateString() === new Date().toDateString();
}

export enum GameType {
    audiocall = "audiocall",
    constructor = "constructor",
    puzzles = "puzzles",
    sprint = "sprint",
}

export type GameResultType = Database["public"]["Tables"]["game_results"]["Row"];

export type NewResultType = Database["public"]["Tables"]["game_results"]["Insert"];

export type ProfileType = Database["public"]["Tables"]["profiles"]["Row"];

export type StatisticsType = Record<string, GameResultType[]>;

export type UserResultsType = {
    total: StatisticsType;
    today: StatisticsType;
};

export function getSum(array: number[]) {
    return array.reduce((sum, value) => sum + value, 0);
}

export function getWordAssetUrl(path: string | null) {
    if (!path) return "";

    return supabase.storage.from("words").getPublicUrl(path).data.publicUrl;
}

export type GetWordsResponse = {
    words: Word[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

export type GetWordsArguments = {
    difficulty: number;
    page: number;
    pageSize?: number;
};

type GameResultRow = Tables<"game_results">;

export type Word = Tables<"words">;

export type UserWordProgress = Tables<"user_word_progress"> & { words: Word | null };
export type UserDashboard = { games: GameResultRow[]; progress: UserWordProgress[]; totalWords: number };

type GameResult = {
    answers: {
        correct: Word[];
        wrong: Word[];
    };
    score: number;
};

type FinishGameArguments = {
    gameName: string;
    result: GameResult;
};

export type FinishGameResponse = {
    game_id: number;
    game_name: string;
    score: number;
    accuracy: number;
    new_words: Word[];
    learned_words: Word[];
};

type GetUserResultsArguments = {
    userId: string;
    date?: string;
};
type FinishPuzzleArguments = {
    score: number;
    correctAnswers: number;
    totalAnswers: number;
};

type FinishPuzzleResponse = {
    game_id: number;
    game_name: "puzzle";
    score: number;
    accuracy: number;
};

export const userApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getUserDashboard: builder.query<UserDashboard, string>({
            async queryFn(userId) {
                try {
                    const games: GameResultRow[] = [];
                    const progress: UserWordProgress[] = [];
                    // Supabase limits each response; read all pages for accurate totals.
                    for (let from = 0; ; from += 500) {
                        const { data, error } = await supabase
                            .from("game_results")
                            .select("*")
                            .eq("user_id", userId)
                            .order("created_at", { ascending: false })
                            .order("id", { ascending: false })
                            .range(from, from + 499);
                        if (error) throw error;
                        games.push(...data);
                        if (data.length < 500) break;
                    }
                    for (let from = 0; ; from += 500) {
                        const { data, error } = await supabase
                            .from("user_word_progress")
                            .select("*, words(*)")
                            .eq("user_id", userId)
                            .order("word_id")
                            .range(from, from + 499);
                        if (error) throw error;
                        progress.push(...data);
                        if (data.length < 500) break;
                    }
                    const { count, error } = await supabase.from("words").select("id", { count: "exact", head: true });
                    if (error) throw error;
                    return { data: { games, progress, totalWords: count ?? 0 } };
                } catch {
                    return { error: { status: "CUSTOM_ERROR", error: "Не удалось загрузить профиль." } };
                }
            },
            providesTags: ["GameResults", "Words"],
        }),
        getUserResults: builder.query<GameResultRow[], GetUserResultsArguments>({
            async queryFn(arguments_) {
                let query = supabase
                    .from("game_results")
                    .select("*")
                    .eq("user_id", arguments_.userId)
                    .order("created_at", { ascending: false });

                if (arguments_?.date) {
                    const [year, month, day] = arguments_.date.split("-").map(Number);

                    const startOfDay = new Date(year, month - 1, day);

                    const endOfDay = new Date(year, month - 1, day + 1);

                    query = query.gte("created_at", startOfDay.toISOString()).lt("created_at", endOfDay.toISOString());
                }

                const { data, error } = await query;

                if (error) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR" as const,
                            error: error.message,
                        },
                    };
                }

                return {
                    data,
                };
            },

            providesTags: ["GameResults"],
        }),

        finishGame: builder.mutation<FinishGameResponse, FinishGameArguments>({
            async queryFn({ gameName, result }) {
                const answers = [
                    ...result.answers.correct.map(word => ({
                        word_id: word.id,
                        is_correct: true,
                    })),

                    ...result.answers.wrong.map(word => ({
                        word_id: word.id,
                        is_correct: false,
                    })),
                ];

                const { data, error } = await supabase.rpc("finish_game", {
                    p_game_name: gameName,
                    p_score: result.score,
                    p_answers: answers,
                });

                if (error) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR" as const,
                            error: error.message,
                        },
                    };
                }

                return {
                    data: data as FinishGameResponse,
                };
            },

            invalidatesTags: ["GameResults"],
        }),
        finishPuzzle: builder.mutation<FinishPuzzleResponse, FinishPuzzleArguments>({
            async queryFn({ score, correctAnswers, totalAnswers }) {
                const { data, error } = await supabase.rpc("finish_puzzle", {
                    p_score: score,
                    p_correct_answers: correctAnswers,
                    p_total_answers: totalAnswers,
                });

                if (error) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR" as const,
                            error: error.message,
                        },
                    };
                }

                return {
                    data: data as FinishPuzzleResponse,
                };
            },

            invalidatesTags: ["GameResults"],
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

        getAllWordsByDifficulty: builder.query<
            {
                words: Word[];
                total: number;
            },
            { difficulty: number }
        >({
            async queryFn({ difficulty }) {
                try {
                    const { data, error, count } = await supabase
                        .from("words")
                        .select("*", { count: "exact" })
                        .eq("difficulty", difficulty)
                        .order("id", { ascending: true });

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

export const {
    useGetUserDashboardQuery,
    useGetUserResultsQuery,
    useGetWordsByDifficultyQuery,
    useGetAllWordsByDifficultyQuery,
    useFinishGameMutation,
    useFinishPuzzleMutation,
} = userApi;
