import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { FirebaseErrorTypes, TextBookValuesTypes, WordBaseValues, WordType } from "../interfaces";
import { getRandom } from "../utils";

function handleError(err: unknown) {
    if (err && typeof err === "object" && "error" in err) {
        const { status, data } = (err as FirebaseErrorTypes).error;
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
                } catch (err) {
                    handleError(err);
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
                } catch (err) {
                    handleError(err);
                }
            },
        }),
    }),
});

export const { useGetAllWordsQuery, useGetRandomWordsQuery } = wordsApi;
