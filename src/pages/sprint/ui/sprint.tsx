import type { GameContextType } from "@/entities/game";
import { useOutletContext } from "react-router-dom";

export default function SprintPage() {
    const context = useOutletContext<GameContextType>();
    console.log(context, "context");

    return <></>;
}
