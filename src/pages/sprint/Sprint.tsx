import React, { useContext, useEffect } from "react";
import SprintShortGame from "./components/SprintShortGame";
import SprintLongGame from "./components/SprintLongGame";
import { resetSprintResult } from "../../store/ResultSlice";
import { useAppDispatch } from "../../store/store";
import { GameContext } from "../game/components/GameStartScreen";
import { DataQueue } from "../../utils";
import ErrorPage, { ErrorType } from "../errorPage/ErrorPage";

function Sprint() {
    const dispatch = useAppDispatch();
    const { initial } = useContext(GameContext);

    useEffect(() => {
        dispatch(resetSprintResult());
    }, [dispatch]);

    if (initial.data) {
        return <SprintShortGame data={new DataQueue({ elements: initial.data, group: initial.group })} />;
    }

    if (initial.group) {
        return <SprintLongGame group={initial.group} />;
    }

    return <ErrorPage type={ErrorType.ERROR} />;
}

export default Sprint;
