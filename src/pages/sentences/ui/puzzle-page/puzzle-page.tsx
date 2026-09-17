import ErrorComponent from "@/shared/ui/error-component/error-component";
import { useOutletContext } from "react-router-dom";
import type { GameContextType } from "@/entities/game";
import { useEffect } from "react";
import PuzzleGame from "../puzzle-game/puzzle-game";
import { useAppDispatch } from "@/app/store/store";

import { resetPuzzleState } from "../../model/puzzle-slice";

export default function PuzzlePage() {
    const context = useOutletContext<Partial<GameContextType>>();

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(resetPuzzleState());
    }, []);

    if (context.data) {
        return <PuzzleGame elements={context.data} complexity={context.complexity} isTimed={context.isTimed} />;
    }

    return <ErrorComponent />;
}
