import clsx from "clsx";
import styles from "./points.module.scss";

function Points({ points, score, penalty = 0 }: { points: number; score: number; penalty?: number }) {
    return (
        <div className={styles.points}>
            <h3>
                Очки: <span className={styles.points__value}>{score}</span>
            </h3>

            <div className={styles.points__note}>
                <p>
                    Верно:{" "}
                    <span className={clsx(styles.points__value, styles["points__value--correct"])}>+{points}</span>
                </p>
                {penalty > 0 && (
                    <p>
                        Неверно:{" "}
                        <span className={clsx(styles.points__value, styles["points__value--penalty"])}>-{penalty}</span>
                    </p>
                )}
            </div>
        </div>
    );
}

export default Points;
