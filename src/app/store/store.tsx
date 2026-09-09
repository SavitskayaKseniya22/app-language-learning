/* eslint-disable unicorn/prefer-spread */
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import resultsReducer from "../../store/result-slice";
import { wordsApi } from "../../store/words-api";
import { userWordsApi } from "../../store/user-words-api";
import { userApi } from "@/entities/user";

const rootReducer = combineReducers({
    [wordsApi.reducerPath]: wordsApi.reducer,
    [userWordsApi.reducerPath]: userWordsApi.reducer,
    resultsReducer,
    [userApi.reducerPath]: userApi.reducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({}).concat(wordsApi.middleware).concat(userWordsApi.middleware).concat(userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
