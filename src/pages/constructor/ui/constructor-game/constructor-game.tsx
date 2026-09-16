import type { ComponentProps } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Points } from "@/shared/ui/points";
import { ProgressTracking } from "@/shared/ui/progress-tracking";
import type { DataQueue } from "../../model/constructor-data-queue";
import styles from "./constructor-game.module.scss";
import { GameInfoContainer } from "@/shared/ui/game-info-container";
import { Timer } from "@/shared/ui/timer";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { constructorInitialSettings, updateConstructorState } from "../../model/constructor-slice";
import { Streak } from "@/shared/ui/streak";
import { Tips } from "@/shared/ui/tips";
import { GameType } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import clsx from "clsx";

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

export default function ConstructorGame({ data, isTimed = false }: { data: DataQueue; isTimed?: boolean }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

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

    const doAfterTimer = () => {
        void navigate(`/games/constructor/result`, {
            state: { data: data.all },
        });
    };

    return (
        <div className={styles.game}>
            <GameInfoContainer>
                <div className={styles.game__header}>
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
            <GameInfoContainer className={styles.game__container}>
                <div className={styles.words}>
                    <p className={styles["words__word--main"]}>{word.word_translate}</p>
                    <p className={styles.words__note}>means</p>
                    {middleResult === null ? (
                        <ul className={styles.game__words}>
                            {word.pressedLetters.map(item => (
                                <li key={item.key} className={styles.game__word}>
                                    {item.value}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <ul className={styles.game__words}>
                            {word.pressedLetters.map((item, index) => (
                                <li
                                    key={item.key}
                                    className={clsx(styles.game__word, {
                                        [styles["game__word--wrong"]]: item.value !== word.word[index],
                                        [styles["game__word--correct"]]: item.value === word.word[index],
                                    })}>
                                    {item.value}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {middleResult === null ? (
                    <ul className={styles.game__words}>
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
                    <p className={styles["words__word--translated"]}>{word.word}</p>
                )}

                {middleResult === null ? (
                    <div className={styles.game__buttons}>
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
                            Clear
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
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
                            See the correct answer
                        </Button>
                    </div>
                ) : (
                    <Button
                        type="button"
                        onClick={() => {
                            if (data.isEmpty) {
                                void navigate("/games/constructor/result", {
                                    state: { data: data.all },
                                });
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
                        Next word
                    </Button>
                )}
            </GameInfoContainer>

            <Tips type={GameType.constructor} />
        </div>
    );
}
