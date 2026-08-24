import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ActiveWordsTypes } from "../../../shared/types/interfaces";
import { ResultType } from "../../../shared/types/interfaces";
import type { DataQueue } from "../../../shared/lib/utilities";
import { checkIfAnswerCorrect } from "../../../shared/lib/utilities";
import Streak from "../../game/components/streak";
import Points from "../../game/components/points";
import SprintRound from "./sprint-round";
import ActiveWordsList from "./active-words-list";
import { useAppDispatch, useAppSelector } from "../../../app/store/store";
import { updateSprintResult } from "../../../store/result-slice";
import GameInfo from "../../game/components/game-info";
import ProgressTracking from "../../game/components/progress-tracking";

function SprintShortGame({ data }: { data: DataQueue }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { sprint } = useAppSelector(state => state.resultsReducer);

    const updater = useCallback(() => data.nextPair(), [data]);

    const [activeWords, setActiveWords] = useState<ActiveWordsTypes>(updater);

    const handleClick = (value: string) => {
        const { first, second } = activeWords;

        const isAnswerCorrect = checkIfAnswerCorrect(value, first, second);

        dispatch(
            updateSprintResult({
                isAnswerCorrect,
                word: first,
                type: ResultType.sprintShort,
            }),
        );

        if (data.isEmpty) {
            navigate(`/games/sprint/result`, {
                state: { data: data.words, group: data.group },
            });
        } else {
            setActiveWords(updater);
        }
    };

    return (
        <main className="main">
            <GameInfo>
                <ProgressTracking streak={data.head} total={data.startLength} />
                <Points step={sprint.step} total={sprint.total} subtrahend={0} />
            </GameInfo>
            <div className="game__container">
                <Streak streak={sprint.streak} total={3} />
                <ActiveWordsList words={activeWords} />
                <SprintRound handleClick={handleClick} />
            </div>
        </main>
    );
}

export default SprintShortGame;
