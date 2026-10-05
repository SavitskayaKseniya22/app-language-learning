import { useStore } from "react-redux";
import type { RootState } from "@/app/store/store";
import { useAuth } from "@/features/auth";
import { useGameFinish } from "@/entities/game/model/use-game-finish";
import { useNavigate } from "react-router-dom";
import DragAndDrop from "../puzzle-dnd/puzzle-dnd";

import { Points } from "@/shared/ui/points";
import { ProgressTracking } from "@/shared/ui/progress-tracking";
import styles from "./puzzle-game.module.scss";
import { GameInfoContainer } from "@/shared/ui/game-info-container";
import { Timer } from "@/shared/ui/timer";
import { puzzleInitialSettings, updateMiddlePuzzleState } from "../../model/puzzle-slice";
import type { Word } from "@/entities/user";
import { useState } from "react";
import { DataQueue } from "../../model/puzzle-data-queue";
import { Button } from "@/shared/ui/button";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { useFinishPuzzleMutation } from "@/entities/user/api/user-api";
import { Spinner } from "@/shared/ui/spinner";
import { toast } from "react-toastify";

export default function PuzzlesGame({
    elements,
    complexity,
    isTimed = false,
}: {
    elements: Word[];
    complexity?: number;
    isTimed?: boolean;
}) {
    const navigate = useNavigate();
    const store = useStore<RootState>();
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const [data] = useState(() => new DataQueue({ elements, complexity }));
    const [word, setWord] = useState(() => data.word);
    const { puzzle } = useAppSelector(state => state.puzzleReducer);
    const [finishPuzzle] = useFinishPuzzleMutation();

    const {
        finish: doAfterTimer,
        ended,
        hasEnded,
        isSaving,
        saveFailed,
    } = useGameFinish(async () => {
        if (isTimed && user) {
            const { puzzle } = store.getState().puzzleReducer;
            await finishPuzzle({
                score: puzzle.score,
                correctAnswers: puzzle.correct,
                totalAnswers: puzzle.correct + puzzle.wrong,
            }).unwrap();
            toast.success("Игра завершена. Результат сохранён.");
        }
        await navigate("/games/puzzles/result", { replace: true });
    });

    return (
        <div className={styles.game}>
            <GameInfoContainer>
                <div className={styles.game__header}>
                    <ProgressTracking streak={data.progress} words={data.all} />
                    {isTimed && <Timer duration={puzzleInitialSettings.timer.default} doAfterTimer={doAfterTimer} />}
                    <Points
                        points={puzzle.points}
                        score={puzzle.score}
                        penalty={puzzleInitialSettings.penalty.default}
                    />
                </div>
            </GameInfoContainer>

            <GameInfoContainer className={styles.game__container} disabled={hasEnded}>
                <div className={styles.game__round}>
                    <p className={styles.game__translation}>{word.text_example_translate}</p>
                    <p className={styles.game__hint}>означает</p>
                    {puzzle.middleResult == null ? (
                        <DragAndDrop word={word} disabled={hasEnded} />
                    ) : (
                        <p
                            className={clsx(styles.game__answer, {
                                [styles["game__answer--correct"]]: puzzle.middleResult === true,
                                [styles["game__answer--wrong"]]: puzzle.middleResult === false,
                            })}>
                            {word.text_example}
                        </p>
                    )}
                </div>

                {puzzle.middleResult === null ? (
                    <>
                        <Button
                            type="button"
                            onClick={() => {
                                if (ended.current) return;
                                dispatch(
                                    updateMiddlePuzzleState({
                                        middleResult: false,
                                    }),
                                );
                            }}>
                            Показать правильный ответ
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            type="button"
                            view="secondary"
                            onClick={() => {
                                if (ended.current) return;

                                if (data.isEmpty) {
                                    doAfterTimer();
                                } else {
                                    dispatch(
                                        updateMiddlePuzzleState({
                                            middleResult: null,
                                        }),
                                    );
                                    setWord(data.nextPuzzle());
                                }
                            }}>
                            Следующее предложение
                        </Button>
                    </>
                )}
            </GameInfoContainer>
            {isSaving && <Spinner />}
            {saveFailed && <Button onClick={doAfterTimer}>Повторить сохранение</Button>}
        </div>
    );
}
