import { useContext, useEffect } from "react";
import SprintShortGame from "./components/sprint-short-game";
import SprintLongGame from "./components/sprint-long-game";
import { resetSprintResult } from "../../store/result-slice";
import { useAppDispatch } from "../../app/store/store";
import { GameContext } from "../game/components/game-start-screen";
import { DataQueue } from "../../shared/lib/utilities";
import ErrorComponent from "@/shared/ui/error-component/error-component";

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

    return <ErrorComponent />;
}

export default Sprint;
