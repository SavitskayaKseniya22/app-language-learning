import type { Word } from "@/entities/user";
import styles from "./progress-tracking.module.scss";
import clsx from "clsx";

type ProgressProperties = { streak: number; label?: string } & (
    { words: Word[]; total?: never } | { total: number; words?: never }
);

export default function ProgressTracking({ streak, words, total, label = "Прогресс" }: ProgressProperties) {
    const count = words?.length ?? total ?? 0;
    const completed = Math.min(Math.max(0, streak), count);
    return (
        <div
            className={styles.progress}
            role="progressbar"
            aria-label={label}
            aria-valuemax={Math.max(1, count)}
            aria-valuenow={completed}
            aria-valuetext={`${completed} из ${count}`}>
            <div className={styles.progress__info}>
                {completed} из {count}
            </div>
            <ul className={styles.progress__list}>
                {words ? (
                    words.map((item, index) => (
                        <li
                            className={clsx(styles.progress__item, {
                                [styles[`progress__item--filled`]]: index < streak,
                            })}
                            key={item.id}
                        />
                    ))
                ) : (
                    <>
                        <li
                            className={clsx(styles.progress__item, styles["progress__item--filled"])}
                            style={{ flexGrow: 0, flexBasis: `${count > 0 ? (completed / count) * 100 : 0}%` }}
                        />
                        <li className={styles.progress__item} />
                    </>
                )}
            </ul>
        </div>
    );
}
