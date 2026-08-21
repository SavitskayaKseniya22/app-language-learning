import React, { useContext, useEffect } from "react";
import PuzzlesGame from "./components/PuzzlesGame";
import Spinner from "../../components/spinner/Spinner";
import { useGetRandomWordsQuery } from "../../store/wordsApi";
import { GameContext } from "../game/components/GameStartScreen";
import { DataQueue, checkStepValue, checkSubtrahendValue, getRandomItemsFromArray } from "../../utils";
import { resetPuzzlesResult, setPuzzlesResult } from "../../store/ResultSlice";
import { useAppDispatch } from "../../store/store";
import ErrorPage, { ErrorType } from "../errorPage/ErrorPage";
import { GameType } from "../../interfaces";

function Puzzles() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(resetPuzzlesResult());
    }, [dispatch]);

    const { initial } = useContext(GameContext);

    const { data, isLoading } = useGetRandomWordsQuery(
        { group: undefined },
        {
            skip: !!initial.data,
        },
    );

    useEffect(() => {
        dispatch(
            setPuzzlesResult({
                step: checkStepValue({
                    difficulty: initial.group,
                    type: GameType.PUZZLES,
                }),
                subtrahend: checkSubtrahendValue({
                    difficulty: initial.group,
                    type: GameType.PUZZLES,
                }),
            }),
        );
    }, [dispatch, initial.group]);

    if (isLoading) return <Spinner />;

    if (initial.data) {
        return (
            <PuzzlesGame
                data={
                    new DataQueue({
                        elements: getRandomItemsFromArray(initial.data, 10),
                        group: initial.group,
                    })
                }
            />
        );
    }

    if (data) {
        return (
            <PuzzlesGame
                data={
                    new DataQueue({
                        elements: getRandomItemsFromArray(data, 10),
                        group: initial.group,
                    })
                }
            />
        );
    }

    return <ErrorPage type={ErrorType.ERROR} />;
}

export default Puzzles;
