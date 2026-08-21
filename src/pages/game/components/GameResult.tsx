import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { StyledMain } from "../../../styled/SharedStyles";
import { useAppSelector } from "../../../store/store";
import GameResultDetailed from "./GameResultDetailed";
import GameResultInfo from "./GameResultInfo";
import { makeLineFromParcedTime, getParcedTime } from "../../../utils";
import { ResultType } from "../../../interfaces";

function GameResult({
    type,
}: {
    type: Exclude<ResultType, ResultType.puzzles | ResultType.sprintShort | ResultType.sprintLong>;
}) {
    const results = useAppSelector(state => state.resultsReducer);
    const result = results[type];
    const location = useLocation();

    const navigate = useNavigate();

    if (result && (result.answers.correct.length || result.answers.wrong.length)) {
        return (
            <StyledMain>
                <h2 className="main__title_main">Results</h2>
                <GameResultDetailed results={results} type={type} />
                <GameResultInfo
                    correct={result.answers.correct.length}
                    wrong={result.answers.wrong.length}
                    total={result.total}>
                    {"time" in result && <div>{makeLineFromParcedTime(getParcedTime({ time: result.time }))}</div>}

                    {location.state?.data && (
                        <button
                            type="button"
                            onClick={() => {
                                navigate(`/games/${type}/game`, {
                                    state: location.state,
                                });
                            }}>
                            repeat the game
                        </button>
                    )}
                </GameResultInfo>
            </StyledMain>
        );
    }

    return <Navigate to="/" />;
}

export default GameResult;
