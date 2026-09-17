import { useNavigate } from "react-router-dom";
import DragAndDrop from "../puzzle-dnd/puzzle-dnd";
import { useAppDispatch, useAppSelector } from "../../../../app/store/store";
import { Points } from "@/shared/ui/points";
import { ProgressTracking } from "@/shared/ui/progress-tracking";
import styles from "./puzzle-game.module.scss";
import { GameInfoContainer } from "@/shared/ui/game-info-container";
import { Timer } from "@/shared/ui/timer";
import { puzzleInitialSettings, updateMiddlePuzzleState, updatePuzzleState } from "../../model/puzzle-slice";
import type { Word } from "@/entities/user";
import { useState } from "react";
import { DataQueue } from "../../model/puzzle-data-queue";
import { Button } from "@/shared/ui/button";
import clsx from "clsx";

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
    const dispatch = useAppDispatch();
    const [data] = useState(() => new DataQueue({ elements, complexity }));

    const { puzzle } = useAppSelector(state => state.puzzleReducer);

    const doAfterTimer = () => {
        void navigate(`/games/puzzles/result`, {
            state: { data: data.all },
        });
    };
    const [word, setWord] = useState(() => data.word);

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

            <GameInfoContainer className={styles.game__container}>
                <div className={styles.game__round}>
                    <p className={styles["words__word--main"]}>{word.text_example_translate}</p>
                    <p className={styles.words__note}>means</p>
                    {puzzle.middleResult !== null && (
                        <>
                            <p
                                className={clsx(styles["words__word--translated"], {
                                    [styles["words__word--true"]]: puzzle.middleResult === true,
                                    [styles["words__word--false"]]: puzzle.middleResult === false,
                                })}>
                                {word.text_example}
                            </p>
                        </>
                    )}
                </div>

                {puzzle.middleResult === null ? (
                    <>
                        <DragAndDrop word={word} />
                        <Button
                            type="button"
                            onClick={() => {
                                console.log("chewck");
                                dispatch(
                                    updateMiddlePuzzleState({
                                        middleResult: false,
                                    }),
                                );
                            }}>
                            Check
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            type="button"
                            view="secondary"
                            onClick={() => {
                                dispatch(updatePuzzleState());

                                if (data.isEmpty) {
                                    void navigate("/games/puzzles/result", { replace: true });
                                } else {
                                    dispatch(
                                        updateMiddlePuzzleState({
                                            middleResult: null,
                                        }),
                                    );
                                    setWord(data.nextPuzzle());
                                }
                            }}>
                            Next sentence
                        </Button>
                    </>
                )}
            </GameInfoContainer>
        </div>
    );
}
