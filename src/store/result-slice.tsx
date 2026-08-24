import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type {
    ComplicatedResultType,
    WordType,
    ResultsState,
    StepType,
    UpdateResultType,
    SubtrahendType,
} from "../interfaces";
import { StepValues, StreakValues, ResultType } from "../interfaces";

export function updateResultData(
    result: ComplicatedResultType,
    isAnswerCorrect: boolean,
    word: WordType,
): ComplicatedResultType {
    const updatedResult = { ...result };

    const total = isAnswerCorrect ? updatedResult.total + updatedResult.step : updatedResult.total;

    const step = isAnswerCorrect
        ? updatedResult.streak === StreakValues.MAX
            ? updatedResult.step + StepValues.MIN
            : updatedResult.step
        : StepValues.MIN;

    const streak =
        (updatedResult.streak === StreakValues.MAX && isAnswerCorrect) || !isAnswerCorrect
            ? (updatedResult.streak = StreakValues.MIN)
            : updatedResult.streak + 1;

    const { correct, wrong } = updatedResult.answers;

    const answers = isAnswerCorrect
        ? {
              wrong,
              correct: [...correct, word],
          }
        : {
              correct,
              wrong: [...wrong, word],
          };

    return {
        answers,
        step,
        total,
        streak,
    };
}

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
        updateSprintResult: (
            state,
            action: PayloadAction<
                UpdateResultType & {
                    type: ResultType.sprintShort | ResultType.sprintLong;
                }
            >,
        ) => {
            state[ResultType.sprint] = {
                ...updateResultData(state[ResultType.sprint], action.payload.isAnswerCorrect, action.payload.word),
                type: action.payload.type,
            };
        },

        resetSprintResult: state => {
            state[ResultType.sprint] = initialState[ResultType.sprint];
        },

        setPuzzlesResult: (state, action: PayloadAction<StepType & SubtrahendType>) => {
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

        updateAudiocallResult: (state, action: PayloadAction<UpdateResultType>) => {
            state.audiocall = updateResultData(state.audiocall, action.payload.isAnswerCorrect, action.payload.word);
        },

        resetAudiocallResult: state => {
            state.audiocall = initComplicatedResultValue;
        },

        setConstructorResult: (state, action: PayloadAction<StepType & SubtrahendType>) => {
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
    resetSprintResult,
    updateSprintResult,
    updatePuzzlesMiddleResult,
    updatePuzzlesTotalResult,
    setPuzzlesResult,
    updateAudiocallResult,
    resetAudiocallResult,
    resetConstructorResult,
    updateConstructorResult,
    resetPuzzlesResult,
    setConstructorResult,
} = resultsSlice.actions;

export default resultsSlice.reducer;
