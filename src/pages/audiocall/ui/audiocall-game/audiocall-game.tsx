import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { audiocallInitialSettings, updateAudiocallState } from "../../model/audiocall-slice";
import { ProgressTracking } from "@/shared/ui/progress-tracking";
import { Points } from "@/shared/ui/points";
import { Streak } from "@/shared/ui/streak";
import { Timer } from "@/shared/ui/timer";
import type { AudiocallWordsType } from "../../model/audiocall-types";
import { AudioButton } from "@/shared/ui/audio-button";
import styles from "./audiocall.module.scss";
import { GameInfoContainer } from "@/shared/ui/game-info-container";
import { Tips } from "@/shared/ui/tips";
import type { Word } from "@/entities/user";
import { GameType } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { DataQueue } from "../../model/audiocall-data-queue";

function AudiocallGame({ elements, isTimed = false }: { elements: Word[]; isTimed?: boolean }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [data] = useState(() => new DataQueue({ elements }));

    const { audiocall } = useAppSelector(state => state.audiocallReducer);

    const [activeWords, setActiveWords] = useState<AudiocallWordsType>(data.words);

    const [middleResult, setMiddleResult] = useState<null | boolean>(null);

    const id = useRef<null | number>(null);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            switch (event.code) {
                case "Digit1": {
                    id.current = activeWords.others[0].id;
                    break;
                }
                case "Digit2": {
                    id.current = activeWords.others[1].id;
                    break;
                }
                case "Digit3": {
                    id.current = activeWords.others[2].id;
                    break;
                }
                case "Digit4": {
                    id.current = activeWords.others[3].id;
                    break;
                }
                case "Digit5": {
                    id.current = activeWords.others[4].id;
                    break;
                }
                default: {
                    break;
                }
            }

            if (id.current) {
                dispatch(
                    updateAudiocallState({
                        isAnswerCorrect: id.current === activeWords.ref.id,
                        word: activeWords.ref,
                    }),
                );
                setMiddleResult(id.current === activeWords.ref.id);
            }
        },
        [dispatch, activeWords.others, activeWords.ref],
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    const doAfterTimer = () => {
        void navigate("/games/audiocall/result", {
            state: { data: data.all },
        });
    };

    return (
        <div className={styles.game}>
            <GameInfoContainer>
                <div className={styles.game__header}>
                    <ProgressTracking streak={data.progress} words={data.all} />
                    <Streak streak={audiocall.streak} total={audiocallInitialSettings.streak.max} />
                    {isTimed && <Timer duration={audiocallInitialSettings.timer.default} doAfterTimer={doAfterTimer} />}
                    <Points points={audiocall.points} score={audiocall.score} />
                </div>
            </GameInfoContainer>

            <GameInfoContainer className={styles.game__container}>
                <div className={styles.game__round}>
                    <AudioButton path={activeWords.ref.audio} />
                    <p className={styles.words__note}>means</p>
                    {middleResult === null ? (
                        <>
                            <div className={styles.game__words}>
                                {activeWords.others.map((element, index) => (
                                    <Button
                                        type="button"
                                        view="transparent"
                                        size="big"
                                        key={element.id}
                                        className={styles.game__word}
                                        onClick={() => {
                                            dispatch(
                                                updateAudiocallState({
                                                    isAnswerCorrect: element.id === activeWords.ref.id,
                                                    word: activeWords.ref,
                                                }),
                                            );

                                            setMiddleResult(element.id === activeWords.ref.id);
                                        }}>
                                        {element.word_translate}
                                        <i>{index + 1}</i>
                                    </Button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <p className={styles["words__word--translated"]}>
                                {activeWords.ref.word} - {activeWords.ref.word_translate}
                            </p>
                        </>
                    )}
                </div>

                {middleResult === null ? (
                    <Button
                        type="button"
                        onClick={() => {
                            setMiddleResult(false);
                            dispatch(
                                updateAudiocallState({
                                    isAnswerCorrect: false,
                                    word: activeWords.ref,
                                }),
                            );
                        }}>
                        See the correct answer
                    </Button>
                ) : (
                    <>
                        <p>{activeWords.ref.text_meaning}</p>
                        <Button
                            type="button"
                            onClick={() => {
                                if (data.isEmpty) {
                                    void navigate("/games/audiocall/result", {
                                        state: { data: data.all },
                                    });
                                } else {
                                    setActiveWords(data.nextFive());
                                    setMiddleResult(null);
                                }
                            }}>
                            Next word
                        </Button>
                    </>
                )}
            </GameInfoContainer>
            <Tips type={GameType.audiocall} />
        </div>
    );
}

export default AudiocallGame;
