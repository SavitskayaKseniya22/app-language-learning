import { useNavigate } from "react-router-dom";
import { GameType } from "@/entities/user";
import styles from "./game-start-screen.module.scss";
import { gamesLabels } from "../../model/games-labels";
import type { SubmitHandler } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { complexityData, difficultyData } from "../../model/difficulty";
import { Button } from "@/shared/ui/button";
import BlockBackground from "@/shared/ui/block-background/block-background";

type FormType = { difficulty: number; complexity: number };

export default function GameStartScreen({ type }: { type: GameType }) {
    const navigate = useNavigate();

    const { register, handleSubmit, control } = useForm<FormType>({
        defaultValues: { difficulty: 0, complexity: 0 },
    });

    const onSubmit: SubmitHandler<FormType> = data => {
        void navigate(`/games/${type}/game`, {
            state: { difficulty: data.difficulty, complexity: data.complexity },
        });
    };

    const difficultyWatch = useWatch({ control, name: "difficulty" });
    const complexityWatch = useWatch({ control, name: "complexity" });
    return (
        <div className={styles.screen}>
            <div>
                <h1>{gamesLabels[type].title}</h1>
                <p>{gamesLabels[type].description.main}</p>
            </div>

            <div className={styles.screen__content}>
                <BlockBackground>
                    <form
                        className={styles.screen__form}
                        onSubmit={event => {
                            void handleSubmit(onSubmit)(event);
                        }}>
                        <div className={styles.screen__section}>
                            <div>
                                <h2>Select the word difficulty level</h2>
                                <p>Each difficulty level contains 600 words</p>
                            </div>

                            <ul className={styles.screen__list}>
                                {difficultyData.map((item, index) => (
                                    <li key={item.title} className={styles.screen__item}>
                                        <label className={styles.screen__difficulty}>
                                            <input
                                                {...register("difficulty")}
                                                type="radio"
                                                value={index}
                                                checked={difficultyWatch == index}
                                            />
                                            <p className={styles.screen__note}>Level {index}</p>
                                            <h3>{item.title}</h3>
                                            <p className={styles.screen__note}>Words {item.count}</p>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {type === GameType.puzzles && (
                            <div className={styles.screen__section}>
                                <div>
                                    <h2>Select the sentence complexity level</h2>
                                    <p>
                                        The sentence will be divided into several parts depending on the selected
                                        difficulty level.
                                    </p>
                                </div>

                                <ul className={styles.screen__list}>
                                    {complexityData.map((item, index) => (
                                        <li key={item.title} className={styles.screen__item}>
                                            <label className={styles.screen__difficulty}>
                                                <input
                                                    {...register("complexity")}
                                                    type="radio"
                                                    value={index}
                                                    checked={complexityWatch == index}
                                                />

                                                <h3>{item.title}</h3>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className={styles.screen__section}>
                            <h2>How to play</h2>
                            <ul className={styles.screen__tips}>
                                {gamesLabels[type].tips.map(tip => (
                                    <li key={tip}>{tip}</li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.screen__footer}>
                            <div></div>
                            <Button type="submit">Start the game</Button>
                        </div>
                    </form>
                </BlockBackground>
            </div>
        </div>
    );
}
