/* eslint-disable unicorn/prefer-spread */
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/es/storage";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from "redux-persist";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "../../store/auth/auth-slice";
import resultsReducer from "../../store/result-slice";
import { authApi } from "../../store/auth/auth-api";
import { wordsApi } from "../../store/words-api";
import { userWordsApi } from "../../store/user-words-api";

const persistConfig = {
    key: "lang-app-root",
    storage,
};

const persistedReducer = persistReducer(
    persistConfig,
    combineReducers({
        auth: authReducer,
    }),
);

const rootReducer = combineReducers({
    persist: persistedReducer,
    [authApi.reducerPath]: authApi.reducer,
    [wordsApi.reducerPath]: wordsApi.reducer,
    [userWordsApi.reducerPath]: userWordsApi.reducer,
    resultsReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })
            .concat(authApi.middleware)
            .concat(wordsApi.middleware)
            .concat(userWordsApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
