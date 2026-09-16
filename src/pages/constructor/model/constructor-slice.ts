import type { Word } from "@/entities/user";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export const constructorInitialSettings = {
    streak: {
        max: 3,
        default: 0,
    },
    points: {
        default: 10,
    },
    timer: {
        default: 60,
    },
    penalty: {
        default: 1,
    },
};

type GameStateType = {
    answers: { correct: Word[]; wrong: Word[] };
    points: number;
    score: number;
    streak: number;
};

const initialState: { constructor: GameStateType } = {
    constructor: {
        answers: { correct: [], wrong: [] },
        points: constructorInitialSettings.points.default,
        score: 0,
        streak: constructorInitialSettings.streak.default,
    },
};

function updateData(state: GameStateType, isAnswerCorrect: boolean, word: Word): GameStateType {
    let score = state.score;
    let points = state.points;
    let streak = state.streak;

    const { correct, wrong } = state.answers;

    let answers = {
        correct,
        wrong,
    };

    if (isAnswerCorrect) {
        streak += 1;

        if (streak > constructorInitialSettings.streak.max) {
            points += constructorInitialSettings.points.default;
            streak = constructorInitialSettings.streak.default;
        }

        score += points;

        answers = {
            wrong,
            correct: [...correct, word],
        };
    } else {
        score = Math.max(score - constructorInitialSettings.penalty.default, 0);

        points = constructorInitialSettings.points.default;
        streak = constructorInitialSettings.streak.default;

        answers = {
            correct,
            wrong: [...wrong, word],
        };
    }

    return {
        ...state,
        answers,
        points,
        score,
        streak,
    };
}

export const constructorStateSlice = createSlice({
    name: "constructor-results",
    initialState,
    reducers: {
        updateConstructorState: (
            state,
            action: PayloadAction<{
                isAnswerCorrect: boolean;
                word: Word;
            }>,
        ) => {
            state.constructor = {
                ...updateData(state.constructor, action.payload.isAnswerCorrect, action.payload.word),
            };
        },

        resetConstructorState: state => {
            state.constructor = initialState.constructor;
        },
    },
});

export const { updateConstructorState, resetConstructorState } = constructorStateSlice.actions;

export default constructorStateSlice.reducer;
