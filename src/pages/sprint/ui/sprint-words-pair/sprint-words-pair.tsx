import type { SprintWordsType } from "../../model/sprint-types";
import styles from "./sprint-words-pair.module.scss";

export default function SprintWordsPair({ words }: { words: SprintWordsType }) {
    return (
        <div className={styles.words}>
            <p className={styles["words__word--main"]}>{words.first.word}</p>

            <p className={styles.words__note}>means</p>
            <p className={styles["words__word--translated"]}>{words.second.word_translate}</p>

            <p className={styles.words__question}>Is this translation correct?</p>
        </div>
    );
}
