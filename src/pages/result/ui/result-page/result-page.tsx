import { GameType } from "@/entities/user";
import styles from "./result-page.module.scss";
import { GameInfoContainer } from "@/shared/ui/game-info-container";
import { ErrorComponent } from "@/shared/ui/error-component";
import { useAppSelector } from "@/app/store/store";
import { getPercent } from "@/shared/lib/math";
import clsx from "clsx";
import { CustomLinkAsButton } from "@/shared/ui/button";
import TextBookTable from "@/pages/textbook/ui/textbook-table/textbook-table";
import type { SprintStateType } from "@/pages/sprint/model/sprint-slice";
import type { PuzzleStateType } from "@/pages/sentences/model/puzzle-slice";

function getResultMessage(percent: number) {
    const messages = [
        "Next time will be better!",
        "You can do better!",
        "Nice! You start learning!",
        "Almost done!",
        "You are a native now. Congrats!",
    ];

    return messages[Math.round(percent / 25)];
}

export default function ResultPage({ type }: { type: GameType }) {
    let passedData: SprintStateType | PuzzleStateType | null = null;

    const { sprint } = useAppSelector(state => state.sprintReducer);
    const { audiocall } = useAppSelector(state => state.audiocallReducer);
    const { constructor } = useAppSelector(state => state.constructorReducer);
    const { puzzle } = useAppSelector(state => state.puzzleReducer);

    if (type === GameType.sprint) {
        passedData = sprint;
    }
    if (type === GameType.audiocall) {
        passedData = audiocall;
    }
    if (type === GameType.constructor) {
        passedData = constructor;
    }

    if (type === GameType.puzzles) {
        passedData = puzzle;
    }

    if (passedData && "answers" in passedData) {
        const totalLength = passedData.answers.correct.length + passedData.answers.wrong.length;

        const accuracy = getPercent(
            passedData.answers.correct.length + passedData.answers.wrong.length,
            passedData.answers.correct.length,
        );

        return (
            <div className={clsx(styles.game, { [styles["game--empty"]]: totalLength === 0 })}>
                {totalLength > 0 ? (
                    <>
                        <GameInfoContainer>
                            <div className={styles.game__header}>
                                <h3>
                                    Total answers: <span>{totalLength}</span>
                                </h3>

                                <h3>
                                    Correct: <span>{passedData.answers.correct.length}</span>
                                </h3>
                                <h3>
                                    Wrong: <span>{passedData.answers.wrong.length}</span>
                                </h3>
                                <h3>
                                    Accuracy: <span>{accuracy}%</span>
                                </h3>
                                <h3 className={styles["game__stat--main"]}>
                                    Score: <span>{passedData.score}</span>
                                </h3>
                            </div>
                        </GameInfoContainer>
                        <GameInfoContainer
                            className={clsx(styles.game__container, styles["game__container--textbook"])}>
                            <div className={styles.game__table}>
                                <h2>Correct answers</h2>
                                <TextBookTable tableId="correct answers" words={passedData.answers.correct} />
                            </div>
                            <div className={styles.game__table}>
                                <h2>Wrong answers</h2>
                                <TextBookTable tableId="wrong answers" words={passedData.answers.wrong} />
                            </div>
                            <div className={styles.game__footer}>
                                <CustomLinkAsButton type="button" to={`/games/${type}`} replace>
                                    Start again
                                </CustomLinkAsButton>
                            </div>
                        </GameInfoContainer>
                    </>
                ) : (
                    <GameInfoContainer className={styles.game__container}>
                        <h2>Not a single answer was given</h2>
                        <CustomLinkAsButton type="button" to={`/games/${type}`} replace>
                            Start again
                        </CustomLinkAsButton>
                    </GameInfoContainer>
                )}
            </div>
        );
    }

    if (passedData && !("answers" in passedData)) {
        const totalLength = passedData.correct + passedData.wrong;

        const accuracy = getPercent(passedData.correct + passedData.wrong, passedData.correct);

        const message = getResultMessage(accuracy);

        return (
            <div className={clsx(styles.game, { [styles["game--empty"]]: totalLength === 0 })}>
                {totalLength > 0 ? (
                    <>
                        <GameInfoContainer>
                            <div className={styles.game__header}>
                                <h3>
                                    Total answers: <span>{totalLength}</span>
                                </h3>

                                <h3>
                                    Correct: <span>{passedData.correct}</span>
                                </h3>
                                <h3>
                                    Wrong: <span>{passedData.wrong}</span>
                                </h3>
                                <h3>
                                    Accuracy: <span>{accuracy}%</span>
                                </h3>
                                <h3 className={styles["game__stat--main"]}>
                                    Score: <span>{passedData.score}</span>
                                </h3>
                            </div>
                        </GameInfoContainer>
                        <GameInfoContainer className={clsx(styles.game__container)}>
                            <h2>{message}</h2>

                            <CustomLinkAsButton type="button" to={`/games/${type}`} replace>
                                Start again
                            </CustomLinkAsButton>
                        </GameInfoContainer>
                    </>
                ) : (
                    <GameInfoContainer className={styles.game__container}>
                        <h2>Not a single answer was given</h2>
                        <CustomLinkAsButton type="button" to={`/games/${type}`} replace>
                            Start again
                        </CustomLinkAsButton>
                    </GameInfoContainer>
                )}
            </div>
        );
    }

    return <ErrorComponent />;
}
