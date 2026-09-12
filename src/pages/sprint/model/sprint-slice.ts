import type { Word } from "@/entities/user";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const gamesInitialSettings = {
    streak: {
        max: 3,
        default: 0,
    },
    points: {
        default: 10,
    },
};

type GameStateType = {
    answers: { correct: Word[]; wrong: Word[] };
    points: number;
    score: number;
    streak: number;
};

function updateData(state: GameStateType, isAnswerCorrect: boolean, word: Word): GameStateType {
    const updatedState = { ...state };

    const score = isAnswerCorrect ? updatedState.score + updatedState.points : updatedState.score;

    const points = isAnswerCorrect
        ? updatedState.streak === gamesInitialSettings.streak.max
            ? updatedState.points + gamesInitialSettings.points.default
            : updatedState.points
        : gamesInitialSettings.points.default;

    const streak =
        (updatedState.streak === gamesInitialSettings.streak.max && isAnswerCorrect) || !isAnswerCorrect
            ? (updatedState.streak = gamesInitialSettings.streak.default)
            : updatedState.streak + 1;

    const { correct, wrong } = updatedState.answers;

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
        points,
        score,
        streak,
    };
}

const initialState: { sprint: GameStateType } = {
    sprint: {
        answers: { correct: [], wrong: [] },
        streak: gamesInitialSettings.points.default,
        points: gamesInitialSettings.points.default,
        score: 0,
    },
};

export const sprintStateSlice = createSlice({
    name: "sprint-results",
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
