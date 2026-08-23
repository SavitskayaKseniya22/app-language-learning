import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../../store/store";
import GameResultInfo from "../../game/components/GameResultInfo";
import { makeLineFromParcedTime, getParcedTime, getPercent } from "../../../utils";

import { ResultType } from "../../../interfaces";
import { useUpdateUserResultsMutation } from "../../../store/userWordsApi";

function PuzzleResult() {
    const { puzzles } = useAppSelector(state => state.resultsReducer);

    const { user } = useAppSelector(state => state.persist.auth);

    const [updateUserResults] = useUpdateUserResultsMutation();

    useEffect(
        () => () => {
            updateUserResults({
                userId: user!.localId,
                type: ResultType.puzzles,
                data: {
                    date: Date.now(),
                    score: puzzles.total,
                    accuracy: getPercent(puzzles.correct + puzzles.wrong, puzzles.correct),
                    time: puzzles.time,
                },
                tokenId: user!.idToken,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    if (puzzles && (puzzles.correct || puzzles.wrong)) {
        return (
            <main className="main">
                <h2 className="main__title_main">Results</h2>
                <GameResultInfo correct={puzzles.correct} wrong={puzzles.wrong} total={puzzles.total}>
                    <ul className="result__detailed">
                        <li>
                            <h4>{`Correct: ${puzzles.correct}`}</h4>
                        </li>
                        <li>
                            <h4>{`Wrong: ${puzzles.wrong}`}</h4>
                        </li>
                    </ul>
                    <div>{makeLineFromParcedTime(getParcedTime({ time: puzzles.time }))}</div>
                </GameResultInfo>
            </main>
        );
    }

    return <Navigate to="/" />;
}

export default PuzzleResult;
