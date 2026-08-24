import { useContext, useEffect } from "react";
import { GameContext } from "../game/components/game-start-screen";
import Spinner from "../../components/spinner/spinner";
import { useGetRandomWordsQuery } from "../../store/words-api";
import { DataQueue } from "../../utilities";
import AudiocallGame from "./components/audiocall-game";
import { useAppDispatch } from "../../store/store";
import { resetAudiocallResult } from "../../store/result-slice";
import ErrorPage from "../error-page/error-page";
import { ErrorType } from "@/interfaces";

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

    return <ErrorPage type={ErrorType.ERROR} />;
}

export default Audiocall;
