import { useEffect } from "react";
import { useAppDispatch } from "../../../../app/store/store";
import ErrorComponent from "@/shared/ui/error-component/error-component";
import { useOutletContext } from "react-router-dom";
import type { GameContextType } from "@/entities/game";
import ConstructorGame from "../constructor-game/constructor-game";
import { resetConstructorState } from "../../model/constructor-slice";

export default function Constructor() {
    const context = useOutletContext<Partial<GameContextType>>();

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(resetConstructorState());
    }, []);

    if (context.data) {
        return <ConstructorGame elements={context.data} isTimed={context.isTimed} />;
    }

    return <ErrorComponent />;
}
