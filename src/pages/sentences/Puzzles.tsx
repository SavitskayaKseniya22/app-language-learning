import { useContext, useEffect } from "react";
import PuzzlesGame from "./components/puzzles-game";
import Spinner from "../../shared/ui/spinner/spinner";
import { useGetRandomWordsQuery } from "../../store/words-api";
import { GameContext } from "../game/components/game-start-screen";
import { DataQueue, checkStepValue, checkSubtrahendValue, getRandomItemsFromArray } from "../../shared/lib/utilities";
import { resetPuzzlesResult, setPuzzlesResult } from "../../store/result-slice";
import { useAppDispatch } from "../../app/store/store";
import { GameType } from "@/entities/user";
import ErrorComponent from "@/shared/ui/error-component/error-component";

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
                    type: GameType.puzzles,
                }),
                subtrahend: checkSubtrahendValue({
                    difficulty: initial.group,
                    type: GameType.puzzles,
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

    return <ErrorComponent />;
}

export default Puzzles;
