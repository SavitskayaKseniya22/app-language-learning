import type { Word } from "@/entities/user";
import styles from "./progress-tracking.module.scss";
import clsx from "clsx";

export default function ProgressTracking({ streak, words }: { words: Word[]; streak: number }) {
    return (
        <div className={styles.progress}>
            <div className={styles.progress__info}>
                {streak} of {words.length}
            </div>
            <ul className={styles.progress__list}>
                {words.map((item, index) => (
                    <li
                        className={clsx(styles.progress__item, { [styles[`progress__item--filled`]]: index < streak })}
                        key={item.id}
                    />
                ))}
            </ul>
        </div>
    );
}
