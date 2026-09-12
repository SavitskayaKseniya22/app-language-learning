import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Streak from "../../../game/components/streak";
import Points from "../../../game/components/points";
import { useAppDispatch, useAppSelector } from "../../../../app/store/store";
import GameInfo from "../../../game/components/game-info";
import ProgressTracking from "../../../game/components/progress-tracking";
import type { DataQueue } from "@/pages/sprint/model/sprint-data-queue";
import { updateSpritState } from "../../model/sprint-slice";
import Timer from "@/pages/game/components/timer";
import type { ActiveWordsType } from "../../model/sprint-types";
import SprintWordsPair from "../sprint-words-pair/sprint-words-pair";
import SprintControls from "../sprint-controls/sprint-controls";

export default function SprintGame({ data, isTimed = false }: { data: DataQueue; isTimed?: boolean }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { sprint } = useAppSelector(state => state.sprintReducer);

    const [activeWords, setActiveWords] = useState<ActiveWordsType>(data.startPair);

    const handleClick = (value: string) => {
        const { first, second } = activeWords;

        const isAnswerCorrect = data.checkIfAnswerCorrect(value, first, second);

        dispatch(
            updateSpritState({
                isAnswerCorrect,
                word: first,
            }),
        );

        if (data.isEmpty) {
            void navigate(`/games/sprint/result`, {
                state: { data: data.all },
            });
        } else {
            const pair = data.nextPair();
            setActiveWords(pair);
        }
    };

    const doAfterTimer = () => {
        void navigate(`/games/sprint/result`, {
            state: { data: data.all },
        });
    };

    return (
        <main className="main">
            <GameInfo>
                <ProgressTracking streak={data.progress} total={data.length} />
                <Points points={sprint.points} score={sprint.score} />
            </GameInfo>
            {isTimed && <Timer duration={60} doAfterTimer={doAfterTimer} />}
            <div className="game__container">
                <Streak streak={sprint.streak} total={3} />
                <SprintWordsPair words={activeWords} />
                <SprintControls handleClick={handleClick} />
            </div>
        </main>
    );
}
