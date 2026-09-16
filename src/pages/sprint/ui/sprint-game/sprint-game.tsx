import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Streak } from "@/shared/ui/streak";
import { Points } from "@/shared/ui/points";
import { useAppDispatch, useAppSelector } from "../../../../app/store/store";
import { ProgressTracking } from "@/shared/ui/progress-tracking";
import type { DataQueue } from "@/pages/sprint/model/sprint-data-queue";
import { sprintInitialSettings, updateSpritState } from "../../model/sprint-slice";
import { Timer } from "@/shared/ui/timer";
import type { SprintWordsType } from "../../model/sprint-types";
import SprintControls from "../sprint-controls/sprint-controls";
import styles from "./sprint-game.module.scss";
import { GameInfoContainer } from "@/shared/ui/game-info-container";
import SprintWordsPair from "../sprint-words-pair/sprint-words-pair";
import { Tips } from "@/shared/ui/tips";
import { GameType } from "@/entities/user";

export default function SprintGame({ data, isTimed = false }: { data: DataQueue; isTimed?: boolean }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { sprint } = useAppSelector(state => state.sprintReducer);

    const [activeWords, setActiveWords] = useState<SprintWordsType>(data.words);

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
        <div className={styles.game}>
            <GameInfoContainer>
                <div className={styles.game__header}>
                    <ProgressTracking streak={data.progress} words={data.all} />
                    <Streak streak={sprint.streak} total={sprintInitialSettings.streak.max} />
                    {isTimed && <Timer duration={sprintInitialSettings.timer.default} doAfterTimer={doAfterTimer} />}
                    <Points points={sprint.points} score={sprint.score} />
                </div>
            </GameInfoContainer>

            <GameInfoContainer className={styles.game__container}>
                <SprintWordsPair words={activeWords} />
                <SprintControls handleClick={handleClick} />
            </GameInfoContainer>

            <Tips type={GameType.sprint} />
        </div>
    );
}
