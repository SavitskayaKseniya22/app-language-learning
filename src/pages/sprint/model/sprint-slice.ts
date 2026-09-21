import type { Word } from "@/entities/user";
import type { FinishGameResponse } from "@/entities/user/api/user-api";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export const sprintInitialSettings = {
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
};

export type SprintStateType = {
    answers: { correct: Word[]; wrong: Word[] };
    points: number;
    score: number;
    streak: number;
    calculatedResult: FinishGameResponse | null;
};

function updateData(state: SprintStateType, isAnswerCorrect: boolean, word: Word): SprintStateType {
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

        if (streak > sprintInitialSettings.streak.max) {
            points += sprintInitialSettings.points.default;
            streak = sprintInitialSettings.streak.default;
        }

        score += points;

        answers = {
            wrong,
            correct: [...correct, word],
        };
    } else {
        points = sprintInitialSettings.points.default;
        streak = sprintInitialSettings.streak.default;

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

const initialState: { sprint: SprintStateType } = {
    sprint: {
        answers: { correct: [], wrong: [] },
        streak: sprintInitialSettings.streak.default,
        points: sprintInitialSettings.points.default,
        score: 0,
        calculatedResult: null,
    },
};

export const sprintStateSlice = createSlice({
    name: "sprint-state",
    initialState,
    reducers: {
        updateSpritState: (state, action: PayloadAction<{ isAnswerCorrect: boolean; word: Word }>) => {
            state.sprint = { ...updateData(state.sprint, action.payload.isAnswerCorrect, action.payload.word) };
        },

        finalizeSprintState: (state, action: PayloadAction<{ calculatedResult: FinishGameResponse }>) => {
            state.sprint = { ...state.sprint, calculatedResult: action.payload.calculatedResult };
        },
        resetSprintState: state => {
            state.sprint = initialState.sprint;
        },
    },
});

export const { updateSpritState, resetSprintState, finalizeSprintState } = sprintStateSlice.actions;

export default sprintStateSlice.reducer;
