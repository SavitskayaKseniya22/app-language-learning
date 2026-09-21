import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Streak } from "@/shared/ui/streak";
import { Points } from "@/shared/ui/points";
import { useAppDispatch, useAppSelector } from "../../../../app/store/store";
import { ProgressTracking } from "@/shared/ui/progress-tracking";
import { finalizeSprintState, sprintInitialSettings, updateSpritState } from "../../model/sprint-slice";
import { Timer } from "@/shared/ui/timer";
import type { SprintWordsType } from "../../model/sprint-types";
import SprintControls from "../sprint-controls/sprint-controls";
import styles from "./sprint-game.module.scss";
import { GameInfoContainer } from "@/shared/ui/game-info-container";
import SprintWordsPair from "../sprint-words-pair/sprint-words-pair";
import { Tips } from "@/shared/ui/tips";
import type { Word } from "@/entities/user";
import { GameType } from "@/entities/user";
import { DataQueue } from "../../model/sprint-data-queue";
import { useFinishGameMutation } from "@/entities/user/api/user-api";
import { toast } from "react-toastify";
import { Spinner } from "@/shared/ui/spinner";

export default function SprintGame({ elements, isTimed = false }: { elements: Word[]; isTimed?: boolean }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [data] = useState(() => new DataQueue({ elements }));

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
            doAfterTimer();
        } else {
            const pair = data.nextPair();
            setActiveWords(pair);
        }
    };
    const [finishGame, { isLoading }] = useFinishGameMutation();

    const isFinishedReference = useRef(false);

    const doAfterTimer = () => {
        if (isFinishedReference.current) {
            return;
        }

        isFinishedReference.current = true;

        try {
            if (isTimed) {
                finishGame({
                    gameName: "sprint",
                    result: { score: sprint.score, answers: sprint.answers },
                })
                    .unwrap()
                    .then(result => {
                        dispatch(finalizeSprintState({ calculatedResult: result }));
                        toast.success("Game is finished. The result is saved");
                        void navigate(`/games/sprint/result`, {
                            replace: true,
                        });
                    })
                    .catch(() => {
                        toast.error("Can't save result");
                    });
            } else {
                void navigate(`/games/sprint/result`, {
                    replace: true,
                });
            }
        } catch {
            isFinishedReference.current = false;
        }
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

            {isLoading && <Spinner />}
        </div>
    );
}
