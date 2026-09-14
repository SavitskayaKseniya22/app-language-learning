import { useAppDispatch } from "@/app/store/store";
import type { GameContextType } from "@/entities/game";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { ErrorComponent } from "@/shared/ui/error-component";
import AudiocallGame from "../audiocall-game/audiocall-game";
import { DataQueue } from "../../model/audiocall-data-queue";
import { resetAudiocallState } from "../../model/audiocall-slice";

export default function AudiocallPage() {
    const context = useOutletContext<Partial<GameContextType>>();

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(resetAudiocallState());
    }, []);

    if (context.data) {
        return <AudiocallGame data={new DataQueue({ elements: context.data })} isTimed={context.isTimed} />;
    }

    return <ErrorComponent />;
}
