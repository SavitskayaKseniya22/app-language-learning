import { useAppDispatch } from "@/app/store/store";
import type { GameContextType } from "@/entities/game";
import { resetSprintResult } from "@/store/result-slice";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { ErrorComponent } from "@/shared/ui/error-component";
import { DataQueue } from "@/pages/sprint/model/sprint-data-queue";
import SprintShortGame from "../sprint-game/sprint-game";

export default function SprintPage() {
    const context = useOutletContext<Partial<GameContextType>>();

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(resetSprintResult());
    }, []);

    if (context.data) {
        return <SprintShortGame data={new DataQueue({ elements: context.data })} isTimed={context.isTimed} />;
    }

    return <ErrorComponent />;
}
