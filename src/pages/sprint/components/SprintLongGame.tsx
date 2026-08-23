import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllWordsQuery } from "../../../store/wordsApi";
import { ActiveWordsTypes, GroupType, ResultType, WordBaseValues } from "../../../interfaces";
import { DataQueue, checkIfAnswerCorrect } from "../../../utils";
import Timer from "../../game/components/Timer";
import Streak from "../../game/components/Streak";
import Points from "../../game/components/Points";
import SprintRound from "./SprintRound";
import ActiveWordsList from "./ActiveWordsList";
import Spinner from "../../../components/spinner/Spinner";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { updateSprintResult } from "../../../store/ResultSlice";
import GameInfo from "../../game/components/GameInfo";
import ErrorPage, { ErrorType } from "../../errorPage/ErrorPage";

function SprintLongGame({ group }: GroupType) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { sprint } = useAppSelector(state => state.resultsReducer);
    const pageRef = useRef(WordBaseValues.MINPAGE);

    const data = useRef<null | DataQueue>(null);

    const [activeWords, setActiveWords] = useState<ActiveWordsTypes | null>(null);

    const { currentData, isLoading, isSuccess } = useGetAllWordsQuery(
        { group, page: pageRef.current },
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
                pageRef.current =
                    pageRef.current < WordBaseValues.MAXPAGE ? pageRef.current + 1 : WordBaseValues.MINPAGE;
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
