import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export const puzzleInitialSettings = {
    points: {
        default: 10,
    },
    timer: {
        default: 120,
    },
    penalty: {
        default: 1,
    },
};

export type PuzzleStateType = {
    points: number;
    score: number;
    streak: number;
    correct: number;
    wrong: number;
    middleResult: boolean | null;
};

const initialState: { puzzle: PuzzleStateType } = {
    puzzle: {
        points: 5,
        score: 0,
        streak: 0,
        correct: 0,
        wrong: 0,
        middleResult: null,
    },
};

export const puzzleStateSlice = createSlice({
    name: "puzzle-state",
    initialState,
    reducers: {
        updateMiddlePuzzleState: (
            state,
            action: PayloadAction<{
                middleResult: boolean | null;
            }>,
        ) => {
            const { middleResult } = action.payload;
            if (middleResult === null) {
                state.puzzle.middleResult = null;
                return;
            }
            if (state.puzzle.middleResult !== null) return;
            state.puzzle.middleResult = middleResult;
            if (state.puzzle.middleResult) {
                state.puzzle.score += state.puzzle.points;
                state.puzzle.correct += 1;
            } else {
                state.puzzle.score = Math.max(0, state.puzzle.score - puzzleInitialSettings.penalty.default);

                state.puzzle.wrong += 1;
            }
        },

        resetPuzzleState: state => {
            state.puzzle = initialState.puzzle;
        },
    },
});

export const { updateMiddlePuzzleState, resetPuzzleState } = puzzleStateSlice.actions;

export default puzzleStateSlice.reducer;
