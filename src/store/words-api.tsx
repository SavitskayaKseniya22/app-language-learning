import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import type { FirebaseErrorTypes, TextBookValuesTypes, WordType } from "../interfaces";
import { WordBaseValues } from "../interfaces";
import { getRandom } from "../utilities";

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
        getAllWords: builder.query<WordType[] | null, TextBookValuesTypes>({
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
