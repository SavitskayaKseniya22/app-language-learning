import type { Word } from "@/entities/user";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export const audiocallInitialSettings = {
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

type AudiocallStateType = {
    answers: { correct: Word[]; wrong: Word[] };
    points: number;
    score: number;
    streak: number;
};

function updateData(state: AudiocallStateType, isAnswerCorrect: boolean, word: Word): AudiocallStateType {
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

        if (streak > audiocallInitialSettings.streak.max) {
            points += audiocallInitialSettings.points.default;
            streak = audiocallInitialSettings.streak.default;
        }

        score += points;

        answers = {
            wrong,
            correct: [...correct, word],
        };
    } else {
        points = audiocallInitialSettings.points.default;
        streak = audiocallInitialSettings.streak.default;

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

const initialState: { audiocall: AudiocallStateType } = {
    audiocall: {
        answers: { correct: [], wrong: [] },
        streak: audiocallInitialSettings.streak.default,
        points: audiocallInitialSettings.points.default,
        score: 0,
    },
};

export const audiocallStateSlice = createSlice({
    name: "audiocall-results",
    initialState,
    reducers: {
        updateAudiocallState: (state, action: PayloadAction<{ isAnswerCorrect: boolean; word: Word }>) => {
            state.audiocall = { ...updateData(state.audiocall, action.payload.isAnswerCorrect, action.payload.word) };
        },

        resetAudiocallState: state => {
            state.audiocall = initialState.audiocall;
        },
    },
});

export const { updateAudiocallState, resetAudiocallState } = audiocallStateSlice.actions;

export default audiocallStateSlice.reducer;
