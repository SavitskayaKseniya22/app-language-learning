import { useNavigate } from "react-router-dom";
import { GameType } from "@/entities/user";
import styles from "./game-start-screen.module.scss";
import type { SubmitHandler } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { complexityData, difficultyData } from "../../model/difficulty";
import { Button } from "@/shared/ui/button";
import { Tips } from "@/shared/ui/tips";

type FormType = { difficulty: string; complexity: string };

export default function GameStartScreen({ type }: { type: GameType }) {
    const navigate = useNavigate();

    const { register, handleSubmit, control } = useForm<FormType>({
        defaultValues: {
            difficulty: String(difficultyData[0].value),
            complexity: String(complexityData[0].value),
        },
    });

    const onSubmit: SubmitHandler<FormType> = data => {
        void navigate(`/games/${type}/game`, {
            state: { difficulty: Number(data.difficulty), complexity: Number(data.complexity), isTimed: true },
        });
    };

    const difficultyWatch = useWatch({ control, name: "difficulty" });
    const complexityWatch = useWatch({ control, name: "complexity" });
    return (
        <form
            className={styles.screen}
            onSubmit={event => {
                void handleSubmit(onSubmit)(event);
            }}>
            <div className={styles.screen__section}>
                <div>
                    <h2>Выберите уровень сложности слов</h2>
                    <p>Каждый уровень содержит 600 слов</p>
                </div>

                <ul className={styles.screen__list}>
                    {difficultyData.map(item => (
                        <li key={item.title} className={styles.screen__item}>
                            <label className={styles.screen__option}>
                                <input
                                    {...register("difficulty")}
                                    type="radio"
                                    value={String(item.value)}
                                    checked={difficultyWatch === String(item.value)}
                                />
                                <span className={styles.screen__note}>Уровень {item.value}</span>
                                <span className={styles.screen__title}>{item.title}</span>
                                <span className={styles.screen__note}>Слова {item.count}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {type === GameType.puzzles && (
                <div className={styles.screen__section}>
                    <div>
                        <h2>Выберите сложность предложений</h2>
                        <p>Предложение будет разделено на фрагменты в зависимости от выбранной сложности.</p>
                    </div>

                    <ul className={styles.screen__list}>
                        {complexityData.map(item => (
                            <li key={item.title} className={styles.screen__item}>
                                <label className={styles.screen__option}>
                                    <input
                                        {...register("complexity")}
                                        type="radio"
                                        value={String(item.value)}
                                        checked={complexityWatch === String(item.value)}
                                    />

                                    <span className={styles.screen__title}>{item.title}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className={styles.screen__section}>
                <h2>Как играть</h2>
                <Tips type={type} />
            </div>

            <div className={styles.screen__footer}>
                <div></div>
                <Button type="submit">Начать игру</Button>
            </div>
        </form>
    );
}
