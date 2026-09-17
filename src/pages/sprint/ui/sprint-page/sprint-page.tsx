import { useAppDispatch } from "@/app/store/store";
import type { GameContextType } from "@/entities/game";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { ErrorComponent } from "@/shared/ui/error-component";
import SprintGame from "../sprint-game/sprint-game";
import { resetSprintState } from "../../model/sprint-slice";

export default function SprintPage() {
    const context = useOutletContext<Partial<GameContextType>>();

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(resetSprintState());
    }, []);

    if (context.data) {
        return <SprintGame elements={context.data} isTimed={context.isTimed} />;
    }

    return <ErrorComponent />;
}
