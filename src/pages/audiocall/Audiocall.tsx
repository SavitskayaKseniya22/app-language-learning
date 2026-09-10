import { useContext, useEffect } from "react";
import { GameContext } from "../../entities/game/ui/game-start-screen/game-start-screen";
import Spinner from "../../shared/ui/spinner/spinner";
import { useGetRandomWordsQuery } from "../../store/words-api";
import { DataQueue } from "../../shared/lib/utilities";
import AudiocallGame from "./components/audiocall-game";
import { useAppDispatch } from "../../app/store/store";
import { resetAudiocallResult } from "../../store/result-slice";
import ErrorComponent from "@/shared/ui/error-component/error-component";

function Audiocall() {
    const { initial } = useContext(GameContext);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(resetAudiocallResult());
    }, [dispatch]);

    const { data, isLoading } = useGetRandomWordsQuery(
        { group: initial.group },
        {
            skip: !!initial.data,
        },
    );

    if (initial.data) {
        return (
            <AudiocallGame
                data={
                    new DataQueue({
                        elements: initial.data,
                        group: initial.group,
                    })
                }
            />
        );
    }

    if (data) {
        return (
            <AudiocallGame
                data={
                    new DataQueue({
                        elements: data,
                        group: initial.group,
                    })
                }
            />
        );
    }

    if (isLoading) return <Spinner />;

    return <ErrorComponent />;
}

export default Audiocall;
