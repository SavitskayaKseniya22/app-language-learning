import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { WordType, ResultsState } from "../shared/types/wrong-interfaces";
import { ResultType } from "../shared/types/wrong-interfaces";

enum StreakValues {
    MIN = 0,
    MAX = 3,
}

export type UpdateResultType = {
    isAnswerCorrect: boolean;
    word: WordType;
    time?: number;
};

const initAnswersValue = { correct: [], wrong: [] };

const initComplicatedResultValue = {
    answers: initAnswersValue,
    step: 10,
    total: 0,
    streak: StreakValues.MIN,
};

const initPuzzlesResultValue = {
    middleResult: false,
    step: 5,
    total: 0,
    correct: 0,
    wrong: 0,
    subtrahend: 1,
    time: 0,
};

const initConstructorResultValue = {
    answers: initAnswersValue,
    step: 5,
    total: 0,
    subtrahend: 1,
    time: 0,
};

const initialState: ResultsState = {
    [ResultType.sprint]: {
        ...initComplicatedResultValue,
        type: ResultType.sprintShort,
    },
    [ResultType.audiocall]: initComplicatedResultValue,
    [ResultType.puzzles]: initPuzzlesResultValue,
    [ResultType.constructor]: initConstructorResultValue,
};

export const resultsSlice = createSlice({
    name: "results",
    initialState,
    reducers: {
        setPuzzlesResult: (state, action: PayloadAction<{ step: number } & { subtrahend: number }>) => {
            state.puzzles = { ...initPuzzlesResultValue, ...action.payload };
        },

        updatePuzzlesMiddleResult: (
            state,
            action: PayloadAction<{
                middleResult: boolean;
            }>,
        ) => {
            state.puzzles.middleResult = action.payload.middleResult;
        },

        updatePuzzlesTotalResult: (state, action: PayloadAction<{ time: number }>) => {
            if (state.puzzles.middleResult) {
                state.puzzles.total += state.puzzles.step;
                state.puzzles.correct += 1;
            } else {
                state.puzzles.total -= state.puzzles.subtrahend;
                state.puzzles.wrong += 1;
            }

            state.puzzles.middleResult = false;
            state.puzzles.time = action.payload.time;
        },

        resetPuzzlesResult: state => {
            state.puzzles = initPuzzlesResultValue;
        },

        setConstructorResult: (state, action: PayloadAction<{ step: number } & { subtrahend: number }>) => {
            state.constructor = { ...initConstructorResultValue, ...action.payload };
        },

        updateConstructorResult: (state, action: PayloadAction<UpdateResultType>) => {
            const answers = action.payload.isAnswerCorrect
                ? {
                      ...state.constructor.answers,
                      correct: [...state.constructor.answers.correct, action.payload.word],
                  }
                : {
                      ...state.constructor.answers,
                      wrong: [...state.constructor.answers.wrong, action.payload.word],
                  };

            const total = action.payload.isAnswerCorrect
                ? state.constructor.total + state.constructor.step
                : state.constructor.total - state.constructor.subtrahend;

            state.constructor = {
                ...state.constructor,
                total,
                answers,
                time: action.payload.time as number,
            };
        },

        resetConstructorResult: state => {
            state.constructor = initConstructorResultValue;
        },
    },
});

export const {
    updatePuzzlesMiddleResult,
    updatePuzzlesTotalResult,
    setPuzzlesResult,

    resetConstructorResult,
    updateConstructorResult,
    resetPuzzlesResult,
    setConstructorResult,
} = resultsSlice.actions;

export default resultsSlice.reducer;
