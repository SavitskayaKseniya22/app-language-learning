import { useStore } from "react-redux";
import type { RootState } from "@/app/store/store";
import { useAuth } from "@/features/auth";
import { useGameFinish } from "@/entities/game/model/use-game-finish";
import type { ComponentProps } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Points } from "@/shared/ui/points";
import { ProgressTracking } from "@/shared/ui/progress-tracking";

import styles from "./constructor-game.module.scss";
import { GameInfoContainer } from "@/shared/ui/game-info-container";
import { Timer } from "@/shared/ui/timer";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import {
    constructorInitialSettings,
    finalizeConstructorState,
    updateConstructorState,
} from "../../model/constructor-slice";
import { Streak } from "@/shared/ui/streak";
import { Tips } from "@/shared/ui/tips";
import type { Word } from "@/entities/user";
import { GameType } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import clsx from "clsx";
import { DataQueue } from "../../model/constructor-data-queue";
import { Spinner } from "@/shared/ui/spinner";
import { useFinishGameMutation } from "@/entities/user/api/user-api";
import { toast } from "react-toastify";

function ConstructorButton({
    clickOnEmpty,
    clickOnFull,
    disabled,
    ...properties
}: ComponentProps<"button"> & { clickOnEmpty: () => void; clickOnFull: () => void }) {
    return (
        <Button
            {...properties}
            view={disabled ? "transparent" : "secondary"}
            type="button"

            onClick={event => {
                if (disabled) {
                    clickOnFull();
                } else {
                    clickOnEmpty();
                }
                if (properties.onClick) {
                    properties.onClick(event);
                }
            }}>
            {properties.children}
        </Button>
    );
}

export default function ConstructorGame({
    elements,

    isTimed = false,
}: {
    elements: Word[];

    isTimed?: boolean;
}) {
    const navigate = useNavigate();
    const store = useStore<RootState>();
    const { user } = useAuth();
    const dispatch = useAppDispatch();

    const [data] = useState(() => new DataQueue({ elements }));

    const { constructor } = useAppSelector(state => state.constructorReducer);

    const [word, setWord] = useState({
        ...data.word,
        pressedLetters: [...data.word.word].map(() => ({
            value: "",
            index: -1,
            key: crypto.randomUUID(),
        })),
    });

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
            const { constructor } = store.getState().constructorReducer;
            const result = await finishGame({
                gameName: "constructor",
                result: { score: constructor.score, answers: constructor.answers },
            }).unwrap();
            dispatch(finalizeConstructorState({ calculatedResult: result }));
            toast.success("Игра завершена. Результат сохранён.");
        }
        await navigate("/games/constructor/result", { replace: true });
    });

    return (
        <div className={styles.assembly}>
            <GameInfoContainer>
                <div className={styles.assembly__header}>
                    <ProgressTracking streak={data.progress} words={data.all} />
                    <Streak streak={constructor.streak} total={constructorInitialSettings.streak.max} />
                    {isTimed && (
                        <Timer duration={constructorInitialSettings.timer.default} doAfterTimer={doAfterTimer} />
                    )}
                    <Points
                        points={constructor.points}
                        score={constructor.score}
                        penalty={constructorInitialSettings.penalty.default}
                    />
                </div>
            </GameInfoContainer>
            <GameInfoContainer className={styles.assembly__content} disabled={hasEnded}>
                <div className={styles.assembly__prompt}>
                    <p className={styles.assembly__translation}>{word.word_translate}</p>
                    <p className={styles.assembly__hint}>означает</p>
                    {middleResult === null ? (
                        <ul className={styles.assembly__letters}>
                            {word.pressedLetters.map(item => (
                                <li key={item.key} className={styles.assembly__letter}>
                                    {item.value}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <ul className={styles.assembly__letters}>
                            {word.pressedLetters.map((item, index) => (
                                <li
                                    key={item.key}
                                    className={clsx(styles.assembly__letter, {
                                        [styles["assembly__letter--wrong"]]: item.value !== word.word[index],
                                        [styles["assembly__letter--correct"]]: item.value === word.word[index],
                                    })}>
                                    {item.value}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {middleResult === null ? (
                    <ul className={styles.assembly__letters}>
                        {word.letters.map(item => (
                            <li key={item.key}>
                                <ConstructorButton
                                    disabled={word.pressedLetters.map(letter => letter.index).includes(item.index)}
                                    clickOnFull={() => {
                                        const copyPressedLetters = [...word.pressedLetters];

                                        const firstEmptyIndex = word.pressedLetters.findIndex(
                                            element => item.index === element.index,
                                        );

                                        copyPressedLetters[firstEmptyIndex].value = "";
                                        copyPressedLetters[firstEmptyIndex].index = -1;

                                        setWord({
                                            ...word,
                                            pressedLetters: [...copyPressedLetters],
                                        });
                                    }}
                                    clickOnEmpty={() => {
                                        const firstEmptyIndex = word.pressedLetters.findIndex(
                                            element => !element.value,
                                        );

                                        const copyPressedLetters = [...word.pressedLetters];

                                        copyPressedLetters[firstEmptyIndex].value = item.value;
                                        copyPressedLetters[firstEmptyIndex].index = item.index;

                                        setWord({
                                            ...word,
                                            pressedLetters: [...copyPressedLetters],
                                        });
                                    }}>
                                    {item.value}
                                </ConstructorButton>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.assembly__answer}>{word.word}</p>
                )}

                {middleResult === null ? (
                    <div className={styles.assembly__actions}>
                        <Button
                            type="button"
                            view="secondary"
                            onClick={() => {
                                setWord({
                                    ...data.word,
                                    pressedLetters: [...data.word.word].map(() => ({
                                        value: "",
                                        index: -1,
                                        key: crypto.randomUUID(),
                                    })),
                                });
                            }}>
                            Очистить
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                if (ended.current) return;
                                const isAnswerCorrect =
                                    word.pressedLetters.map(item => item.value).join("") === word.word;

                                setMiddleResult(isAnswerCorrect);

                                dispatch(
                                    updateConstructorState({
                                        isAnswerCorrect,
                                        word,
                                    }),
                                );
                            }}>
                            Показать правильный ответ
                        </Button>
                    </div>
                ) : (
                    <Button
                        type="button"
                        onClick={() => {
                            if (data.isEmpty) {
                                doAfterTimer();
                            } else {
                                data.nextWordLikeArray();
                                setWord({
                                    ...data.word,
                                    pressedLetters: [...data.word.word].map(() => ({
                                        value: "",
                                        index: -1,
                                        key: crypto.randomUUID(),
                                    })),
                                });
                                setMiddleResult(null);
                            }
                        }}>
                        Следующее слово
                    </Button>
                )}
            </GameInfoContainer>

            <Tips type={GameType.constructor} />
            {isSaving && <Spinner />}
            {saveFailed && <Button onClick={doAfterTimer}>Повторить сохранение</Button>}
        </div>
    );
}
