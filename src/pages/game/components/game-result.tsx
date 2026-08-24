import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../app/store/store";
import GameResultDetailed from "./game-result-detailed";
import GameResultInfo from "./game-result-info";
import { makeLineFromParcedTime, getParcedTime } from "../../../shared/lib/utilities";
import type { ResultType } from "../../../shared/types/interfaces";

function GameResult({
    type,
}: {
    type: Exclude<ResultType, ResultType.puzzles | ResultType.sprintShort | ResultType.sprintLong>;
}) {
    const results = useAppSelector(state => state.resultsReducer);
    const result = results[type];
    const location = useLocation();

    const navigate = useNavigate();

    if (result && (result.answers.correct.length > 0 || result.answers.wrong.length > 0)) {
        return (
            <main className="main">
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
            </main>
        );
    }

    return <Navigate to="/" />;
}

export default GameResult;
