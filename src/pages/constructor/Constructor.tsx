import { useContext, useEffect } from "react";
import { GameContext } from "../game/components/game-start-screen";
import Spinner from "../../shared/ui/spinner/spinner";
import { useGetRandomWordsQuery } from "../../store/words-api";
import { DataQueue, checkStepValue, checkSubtrahendValue } from "../../shared/lib/utilities";
import ConstructorGame from "./components/constructor-game";
import { useAppDispatch } from "../../app/store/store";
import { resetConstructorResult, setConstructorResult } from "../../store/result-slice";
import { GameType } from "@/app/api/user-api";
import ErrorComponent from "@/shared/ui/error-component/error-component";

function Constructor() {
    const { initial } = useContext(GameContext);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(resetConstructorResult());
    }, [dispatch]);

    const { data, isLoading } = useGetRandomWordsQuery(
        { group: initial.group },
        {
            skip: !!initial.data,
        },
    );

    useEffect(() => {
        dispatch(
            setConstructorResult({
                step: checkStepValue({
                    difficulty: initial.group,
                    type: GameType.constructor,
                }),
                subtrahend: checkSubtrahendValue({
                    difficulty: initial.group,
                    type: GameType.constructor,
                }),
            }),
        );
    }, [dispatch, initial.group]);

    if (initial.data) {
        return <ConstructorGame data={new DataQueue({ elements: initial.data, group: initial.group })} />;
    }

    if (data) {
        return <ConstructorGame data={new DataQueue({ elements: data, group: initial.group })} />;
    }

    if (isLoading) return <Spinner />;

    return <ErrorComponent />;
}

export default Constructor;
