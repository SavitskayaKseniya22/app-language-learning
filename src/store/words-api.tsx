import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import type { WordType } from "../shared/types/wrong-interfaces";

import { getRandom } from "../shared/lib/math";

enum WordBaseValues {
    MINGROUP = 0,
    MAXGROUP = 5,
    MINPAGE = 0,
    MAXPAGE = 29,
    MAXWORD = 19,
    MINWORD = 0,
}

interface FirebaseErrorTypes {
    error: {
        status: string;
        data: { error: string };
    };
    isUnhandledError: boolean;
    meta: {
        request: {};
        response: {};
    };
}

function handleError(error: unknown) {
    if (error && typeof error === "object" && "error" in error) {
        const { status, data } = (error as FirebaseErrorTypes).error;
        toast.error(`${status}: ${data.error}`);
    } else {
        toast.error(`Not specific error`);
    }
}

export const wordsApi = createApi({
    reducerPath: "wordsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://lang--app-default-rtdb.europe-west1.firebasedatabase.app/words",
    }),
    endpoints: builder => ({
        getAllWords: builder.query<WordType[] | null, { group: string; page: number }>({
            query: ({ group, page }) => ({
                url: `/${group}/${page}.json`,
                method: "GET",
            }),
            async onQueryStarted(id, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (error) {
                    handleError(error);
                }
            },
        }),

        getRandomWords: builder.query<WordType[] | null, { group?: string }>({
            query: ({ group }) => ({
                url: `/${group || getRandom(0, WordBaseValues.MAXGROUP)}/${getRandom(0, WordBaseValues.MAXPAGE)}.json`,
                method: "GET",
            }),
            keepUnusedDataFor: 0,
            async onQueryStarted(id, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (error) {
                    handleError(error);
                }
            },
        }),
    }),
});

export const { useGetAllWordsQuery, useGetRandomWordsQuery } = wordsApi;
