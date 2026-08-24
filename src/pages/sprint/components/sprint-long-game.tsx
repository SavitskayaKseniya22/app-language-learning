import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllWordsQuery } from "../../../store/words-api";
import type { ActiveWordsTypes, GroupType } from "../../../shared/types/interfaces";
import { ErrorType, ResultType, WordBaseValues } from "../../../shared/types/interfaces";
import { DataQueue, checkIfAnswerCorrect } from "../../../shared/lib/utilities";
import Timer from "../../game/components/timer";
import Streak from "../../game/components/streak";
import Points from "../../game/components/points";
import SprintRound from "./sprint-round";
import ActiveWordsList from "./active-words-list";
import Spinner from "../../../components/spinner/spinner";
import { useAppDispatch, useAppSelector } from "../../../app/store/store";
import { updateSprintResult } from "../../../store/result-slice";
import GameInfo from "../../game/components/game-info";
import ErrorPage from "../../error-page/error-page";

function SprintLongGame({ group }: GroupType) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { sprint } = useAppSelector(state => state.resultsReducer);
    const pageReference = useRef(WordBaseValues.MINPAGE);

    const data = useRef<null | DataQueue>(null);

    const [activeWords, setActiveWords] = useState<ActiveWordsTypes | null>(null);

    const { currentData, isLoading, isSuccess } = useGetAllWordsQuery(
        { group, page: pageReference.current },
        {
            refetchOnMountOrArgChange: true,
        },
    );

    useEffect(() => {
        if (currentData) {
            const dataQueue = new DataQueue({
                elements: currentData,
                group,
            });
            data.current = dataQueue;
            setActiveWords(dataQueue.nextPair());
        }
    }, [currentData, group]);

    const handleClick = (value: string) => {
        if (data.current && activeWords) {
            const { first, second } = activeWords;

            const isAnswerCorrect = checkIfAnswerCorrect(value, first, second);

            dispatch(
                updateSprintResult({
                    isAnswerCorrect,
                    word: first,
                    type: ResultType.sprintLong,
                }),
            );

            if (data.current.isEmpty) {
                pageReference.current =
                    pageReference.current < WordBaseValues.MAXPAGE ? pageReference.current + 1 : WordBaseValues.MINPAGE;
            } else {
                setActiveWords(data.current.nextPair());
            }
        }
    };

    const doAfterTimer = useCallback(() => {
        navigate(`/games/sprint/result`);
    }, [navigate]);

    if (isLoading || (isSuccess && data.current === null)) return <Spinner />;

    if (data.current && activeWords) {
        return (
            <main className="main">
                <GameInfo>
                    <Points step={sprint.step} total={sprint.total} subtrahend={0} />
                </GameInfo>
                <Timer duration={60} doAfterTimer={doAfterTimer} />

                <div className="game__container">
                    <Streak streak={sprint.streak} total={3} />
                    <ActiveWordsList words={activeWords} />
                    <SprintRound handleClick={handleClick} />
                </div>
            </main>
        );
    }

    return <ErrorPage type={ErrorType.ERROR} />;
}

export default SprintLongGame;
