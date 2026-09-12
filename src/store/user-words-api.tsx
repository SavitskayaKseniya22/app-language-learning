import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import type { WordWithIdDataType, WordWithIdType, ResultType } from "../shared/types/wrong-interfaces";
import { handleLogout } from "@/features/auth";

enum CollectionType {
    DIFFICULT = "difficult",
    LEARNED = "learned",
    SELECTED = "selected",
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
export function handleError(error: unknown) {
    if (error && typeof error === "object" && "error" in error) {
        const { status, data } = (error as FirebaseErrorTypes).error;
        toast.error(`${status}: ${data.error}`);
        void handleLogout();
    } else {
        toast.error(`Not specific error`);
    }
}
export type TokenIdType = { tokenId: string };
export type UserIdType = { userId: string };
export type CredentialsType = UserIdType & TokenIdType;
export type WordIdType = { wordId: string };

export type StatiscticsItemType = {
    [ResultType.sprintShort]: BasicResultType & WordsResultType;
    [ResultType.sprintLong]: BasicResultType & WordsResultType;
    [ResultType.audiocall]: BasicResultType & WordsResultType;
    [ResultType.constructor]: BasicResultType & WordsResultType & TimeType;
    [ResultType.puzzles]: BasicResultType & TimeType;
};

export type TimeType = { time: number };

export type BasicResultType = {
    date: number;
    score: number;
    accuracy: number;
};

export type WordsResultType = {
    encountered: number;
    learned: number;
};
export interface CollectionLikeArraysType {
    [CollectionType.DIFFICULT]: WordWithIdDataType[];
    [CollectionType.LEARNED]: WordWithIdDataType[];
    [CollectionType.SELECTED]: WordWithIdDataType[];
    all: WordWithIdDataType[];
}

const generateRandomString = () => Math.floor(Math.random() * Date.now()).toString(36);

export const userWordsApi = createApi({
    reducerPath: "userWordsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://lang--app-default-rtdb.europe-west1.firebasedatabase.app/users",
    }),
    tagTypes: ["UserCollection", "UserWord", "UserWords"],

    endpoints: builder => ({
        createUserData: builder.mutation<UserIdType, CredentialsType>({
            query: ({ userId, tokenId }) => ({
                url: `/${userId}.json`,
                body: {
                    userId,
                    words: {},
                },
                method: "PUT",
                params: { auth: tokenId },
            }),
            async onQueryStarted(id, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (error) {
                    handleError(error);
                }
            },
        }),

        getUserWords: builder.query<WordWithIdType | null, CredentialsType>({
            query: ({ userId, tokenId }) => ({
                url: `/${userId}/words/.json`,
                method: "GET",
                params: { auth: tokenId },
            }),
            providesTags: ["UserWords"],
            keepUnusedDataFor: 0,
            async onQueryStarted(id, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (error) {
                    handleError(error);
                }
            },
        }),

        getUserWord: builder.query<WordWithIdDataType | null, CredentialsType & WordIdType>({
            query: ({ userId, wordId, tokenId }) => ({
                url: `/${userId}/words/${wordId}.json`,
                method: "GET",
                params: { auth: tokenId },
            }),
            keepUnusedDataFor: 0,
            providesTags: ["UserWord"],
            async onQueryStarted(id, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (error) {
                    handleError(error);
                }
            },
        }),

        getUserWordsCollections: builder.query<CollectionLikeArraysType, CredentialsType>({
            query: ({ userId, tokenId }) => ({
                url: `/${userId}/words/.json`,
                method: "GET",
                params: { auth: tokenId },
            }),
            keepUnusedDataFor: 0,
            providesTags: ["UserCollection"],
            async onQueryStarted(id, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (error) {
                    handleError(error);
                }
            },

            transformResponse: (response: WordWithIdType | null) => {
                const responseValues = Object.values(response || {});

                return {
                    [CollectionType.DIFFICULT]: responseValues.filter(value => value[CollectionType.DIFFICULT]),
                    [CollectionType.LEARNED]: responseValues.filter(value => value[CollectionType.LEARNED]),
                    [CollectionType.SELECTED]: responseValues.filter(value => value[CollectionType.SELECTED]),
                    all: responseValues,
                };
            },
        }),

        addToUserWords: builder.mutation<WordWithIdType, CredentialsType & { data: WordWithIdType }>({
            query: ({ userId, data, tokenId }) => ({
                url: `/${userId}/words/.json`,
                body: data,
                method: "PATCH",
                params: { auth: tokenId },
            }),
            invalidatesTags: ["UserCollection"],
            async onQueryStarted(id, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (error) {
                    handleError(error);
                }
            },
        }),

        updateUserWord: builder.mutation<WordWithIdType, CredentialsType & WordIdType & { data: WordWithIdDataType }>({
            query: ({ userId, data, wordId, tokenId }) => ({
                url: `/${userId}/words/${wordId}/.json`,
                body: data,
                method: "PATCH",
                params: { auth: tokenId },
            }),
            invalidatesTags: ["UserCollection", "UserWord", "UserWords"],
            async onQueryStarted(id, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (error) {
                    handleError(error);
                }
            },
        }),

        updateUserResults: builder.mutation<
            StatiscticsItemType[keyof StatiscticsItemType],
            CredentialsType & {
                type: ResultType;
            } & {
                data: StatiscticsItemType[keyof StatiscticsItemType];
            }
        >({
            query: ({ userId, data, type, tokenId }) => ({
                url: `/${userId}/results/${type}/.json`,
                body: { [generateRandomString()]: data },
                method: "PATCH",
                params: { auth: tokenId },
            }),

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

export const {
    useGetUserWordsQuery,
    useAddToUserWordsMutation,
    useCreateUserDataMutation,
    useGetUserWordsCollectionsQuery,
    useGetUserWordQuery,

    useUpdateUserWordMutation,
    useUpdateUserResultsMutation,
} = userWordsApi;
