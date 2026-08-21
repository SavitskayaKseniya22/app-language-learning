import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ThunkDispatch, AnyAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
    CollectionLikeArraysType,
    CollectionType,
    CredentialsType,
    FirebaseErrorTypes,
    ResultType,
    StatiscticsItemType,
    StatiscticsResponseType,
    UserIdType,
    UserResultsType,
    WordIdType,
    WordWithIdDataType,
    WordWithIdType,
} from "../interfaces";
import { resetUser } from "./auth/authSlice";
import { generateRandomString, sortPreData } from "../utils";

export function handleError(
    err: unknown,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch: ThunkDispatch<any, any, AnyAction>,
) {
    if (err && typeof err === "object" && "error" in err) {
        const { status, data } = (err as FirebaseErrorTypes).error;
        toast.error(`${status}: ${data.error}`);
        dispatch(resetUser());
    } else {
        toast.error(`Not specific error`);
    }
}

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
            async onQueryStarted(id, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;
                } catch (err) {
                    handleError(err, dispatch);
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
            async onQueryStarted(id, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;
                } catch (err) {
                    handleError(err, dispatch);
                }
            },
        }),

        getUserResults: builder.query<UserResultsType, CredentialsType>({
            query: ({ userId, tokenId }) => ({
                url: `/${userId}/results/.json`,
                method: "GET",
                params: { auth: tokenId },
            }),

            keepUnusedDataFor: 0,
            async onQueryStarted(id, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;
                } catch (err) {
                    handleError(err, dispatch);
                }
            },

            transformResponse: (response: StatiscticsResponseType | null): UserResultsType => {
                const extractedData = {
                    [ResultType.sprintShort]: Object.values(response?.[ResultType.sprintShort] || {}),
                    [ResultType.sprintLong]: Object.values(response?.[ResultType.sprintLong] || {}),
                    [ResultType.audiocall]: Object.values(response?.[ResultType.audiocall] || {}),
                    [ResultType.constructor]: Object.values(response?.[ResultType.constructor] || {}),
                    [ResultType.puzzles]: Object.values(response?.[ResultType.puzzles] || {}),
                };

                return {
                    today: sortPreData(extractedData),
                    total: extractedData,
                };
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
            async onQueryStarted(id, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;
                } catch (err) {
                    handleError(err, dispatch);
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
            async onQueryStarted(id, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;
                } catch (err) {
                    handleError(err, dispatch);
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
            async onQueryStarted(id, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;
                } catch (err) {
                    handleError(err, dispatch);
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
            async onQueryStarted(id, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;
                } catch (err) {
                    handleError(err, dispatch);
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

            async onQueryStarted(id, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;
                } catch (err) {
                    handleError(err, dispatch);
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
    useGetUserResultsQuery,
    useUpdateUserWordMutation,
    useUpdateUserResultsMutation,
} = userWordsApi;
