import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export const puzzleInitialSettings = {
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
            state.puzzle.middleResult = action.payload.middleResult;
        },

        updatePuzzleState: state => {
            if (state.puzzle.middleResult) {
                state.puzzle.score += state.puzzle.points;
                state.puzzle.correct += 1;
            } else {
                state.puzzle.score =
                    state.puzzle.score > 0
                        ? (state.puzzle.score -= puzzleInitialSettings.penalty.default)
                        : state.puzzle.score;

                state.puzzle.wrong += 1;
            }

            state.puzzle.middleResult = false;
        },

        resetPuzzleState: state => {
            state.puzzle = initialState.puzzle;
        },
    },
});

export const { updateMiddlePuzzleState, updatePuzzleState, resetPuzzleState } = puzzleStateSlice.actions;

export default puzzleStateSlice.reducer;
