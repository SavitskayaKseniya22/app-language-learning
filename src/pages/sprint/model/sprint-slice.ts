import type { Word } from "@/entities/user";
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
        default: 10,
        //todo change to 60
    },
};

export type SprintStateType = {
    answers: { correct: Word[]; wrong: Word[] };
    points: number;
    score: number;
    streak: number;
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
    },
};

export const sprintStateSlice = createSlice({
    name: "sprint-state",
    initialState,
    reducers: {
        updateSpritState: (state, action: PayloadAction<{ isAnswerCorrect: boolean; word: Word }>) => {
            state.sprint = { ...updateData(state.sprint, action.payload.isAnswerCorrect, action.payload.word) };
        },

        resetSprintState: state => {
            state.sprint = initialState.sprint;
        },
    },
});

export const { updateSpritState, resetSprintState } = sprintStateSlice.actions;

export default sprintStateSlice.reducer;
