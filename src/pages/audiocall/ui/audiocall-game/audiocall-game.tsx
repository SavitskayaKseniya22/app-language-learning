import { useStore } from "react-redux";
import type { RootState } from "@/app/store/store";
import { useAuth } from "@/features/auth";
import { useGameFinish } from "@/entities/game/model/use-game-finish";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { audiocallInitialSettings, finalizeAudiocallState, updateAudiocallState } from "../../model/audiocall-slice";
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
import { useFinishGameMutation } from "@/entities/user/api/user-api";
import { toast } from "react-toastify";
import { Spinner } from "@/shared/ui/spinner";

function AudiocallGame({ elements, isTimed = false }: { elements: Word[]; isTimed?: boolean }) {
    const navigate = useNavigate();
    const store = useStore<RootState>();
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const [data] = useState(() => new DataQueue({ elements }));

    const { audiocall } = useAppSelector(state => state.audiocallReducer);

    const [activeWords, setActiveWords] = useState<AudiocallWordsType>(data.words);

    const [middleResult, setMiddleResult] = useState<null | boolean>(null);

    const [finishGame] = useFinishGameMutation();

    const {
        finish: doAfterTimer,
        ended,
        hasEnded,
        isSaving,
        saveFailed,
    } = useGameFinish(async () => {
        if (isTimed && user) {
            const { audiocall } = store.getState().audiocallReducer;
            const result = await finishGame({
                gameName: "audiocall",
                result: { score: audiocall.score, answers: audiocall.answers },
            }).unwrap();
            dispatch(finalizeAudiocallState({ calculatedResult: result }));
            toast.success("Игра завершена. Результат сохранён.");
        }
        await navigate("/games/audiocall/result", { replace: true });
    });

    const answered = useRef(false);

    const answer = useCallback(
        (selectedId: number | null) => {
            if (answered.current || ended.current) return;
            answered.current = true;
            const isAnswerCorrect = selectedId === activeWords.ref.id;
            dispatch(updateAudiocallState({ isAnswerCorrect, word: activeWords.ref }));
            setMiddleResult(isAnswerCorrect);
        },
        [activeWords.ref, dispatch, ended],
    );

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.repeat || !/^Digit[1-5]$/.test(event.code)) return;
            event.preventDefault();
            const selectedWord = activeWords.others[Number(event.code.slice(-1)) - 1];
            if (selectedWord) answer(selectedWord.id);
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [activeWords.others, answer]);

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

            <GameInfoContainer className={styles.game__container} disabled={hasEnded}>
                <div className={styles.game__round}>
                    <AudioButton path={activeWords.ref.audio} />
                    <p className={styles.game__hint}>означает</p>
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
                                        onClick={() => answer(element.id)}>
                                        {element.word_translate}
                                        <i>{index + 1}</i>
                                    </Button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <p className={styles.game__answer}>
                                {activeWords.ref.word} - {activeWords.ref.word_translate}
                            </p>
                        </>
                    )}
                </div>

                {middleResult === null ? (
                    <Button type="button" onClick={() => answer(null)}>
                        Показать правильный ответ
                    </Button>
                ) : (
                    <>
                        <p>{activeWords.ref.text_meaning}</p>
                        <Button
                            type="button"
                            onClick={() => {
                                if (ended.current) return;
                                if (data.isEmpty) {
                                    doAfterTimer();
                                } else {
                                    setActiveWords(data.nextFive());
                                    answered.current = false;
                                    setMiddleResult(null);
                                }
                            }}>
                            Следующее слово
                        </Button>
                    </>
                )}
            </GameInfoContainer>
            <Tips type={GameType.audiocall} />
            {isSaving && <Spinner />}
            {saveFailed && <Button onClick={doAfterTimer}>Повторить сохранение</Button>}
        </div>
    );
}

export default AudiocallGame;
