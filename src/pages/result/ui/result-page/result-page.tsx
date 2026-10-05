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
            <div className={clsx(styles.result, { [styles["result--empty"]]: totalLength === 0 })}>
                {totalLength > 0 ? (
                    <>
                        <GameInfoContainer>
                            <div className={styles.result__summary}>
                                <h3>
                                    Всего ответов: <span>{totalLength}</span>
                                </h3>

                                <h3>
                                    Верно: <span>{passedData.answers.correct.length}</span>
                                </h3>
                                <h3>
                                    Неверно: <span>{passedData.answers.wrong.length}</span>
                                </h3>
                                <h3>
                                    Точность: <span>{accuracy}%</span>
                                </h3>
                                <h3 className={styles.result__score}>
                                    Очки: <span>{passedData.score}</span>
                                </h3>
                            </div>
                        </GameInfoContainer>
                        <GameInfoContainer
                            className={clsx(styles.result__content, styles["result__content--detailed"])}>
                            <div className={styles.result__answers}>
                                <h2>Правильные ответы</h2>
                                <TextBookTable
                                    tableId="correct answers"
                                    words={passedData.answers.correct}
                                    new_words={passedData.calculatedResult?.new_words}
                                    learned_words={passedData.calculatedResult?.learned_words}
                                />
                            </div>
                            <div className={styles.result__answers}>
                                <h2>Неправильные ответы</h2>
                                <TextBookTable
                                    tableId="wrong answers"
                                    words={passedData.answers.wrong}
                                    new_words={passedData.calculatedResult?.new_words}
                                    learned_words={passedData.calculatedResult?.learned_words}
                                />
                            </div>
                            <div className={styles.result__actions}>
                                <CustomLinkAsButton type="button" to={`/games/${type}`} replace>
                                    Играть снова
                                </CustomLinkAsButton>
                            </div>
                        </GameInfoContainer>
                    </>
                ) : (
                    <GameInfoContainer className={styles.result__content}>
                        <h2>Вы не дали ни одного ответа</h2>
                        <CustomLinkAsButton type="button" to={`/games/${type}`} replace>
                            Играть снова
                        </CustomLinkAsButton>
                    </GameInfoContainer>
                )}
            </div>
        );
    }

    if (passedData && !("answers" in passedData)) {
        const totalLength = passedData.correct + passedData.wrong;

        const accuracy = getPercent(passedData.correct + passedData.wrong, passedData.correct);

        return (
            <div className={clsx(styles.result, { [styles["result--empty"]]: totalLength === 0 })}>
                {totalLength > 0 ? (
                    <>
                        <GameInfoContainer>
                            <div className={styles.result__summary}>
                                <h3>
                                    Всего ответов: <span>{totalLength}</span>
                                </h3>

                                <h3>
                                    Верно: <span>{passedData.correct}</span>
                                </h3>
                                <h3>
                                    Неверно: <span>{passedData.wrong}</span>
                                </h3>
                                <h3>
                                    Точность: <span>{accuracy}%</span>
                                </h3>
                                <h3 className={styles.result__score}>
                                    Очки: <span>{passedData.score}</span>
                                </h3>
                            </div>
                        </GameInfoContainer>
                        <GameInfoContainer className={clsx(styles.result__content)}>
                            <h2>Игра завершена</h2>

                            <CustomLinkAsButton type="button" to={`/games/${type}`} replace>
                                Играть снова
                            </CustomLinkAsButton>
                        </GameInfoContainer>
                    </>
                ) : (
                    <GameInfoContainer className={styles.result__content}>
                        <h2>Вы не дали ни одного ответа</h2>
                        <CustomLinkAsButton type="button" to={`/games/${type}`} replace>
                            Играть снова
                        </CustomLinkAsButton>
                    </GameInfoContainer>
                )}
            </div>
        );
    }

    return <ErrorComponent />;
}
