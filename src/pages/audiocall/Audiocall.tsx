import React, { useContext, useEffect } from "react";
import { GameContext } from "../game/components/GameStartScreen";
import Spinner from "../../components/spinner/Spinner";
import { useGetRandomWordsQuery } from "../../store/wordsApi";
import { DataQueue } from "../../utils";
import AudiocallGame from "./components/AudiocallGame";
import { useAppDispatch } from "../../store/store";
import { resetAudiocallResult } from "../../store/ResultSlice";
import ErrorPage, { ErrorType } from "../errorPage/ErrorPage";

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
