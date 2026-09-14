import styles from "./streak.module.scss";
import clsx from "clsx";

export default function Streak({ streak, total }: { total: number; streak: number }) {
    return (
        <ul className={styles.streak}>
            {Array.from({ length: total }, (_, index) => index).map(item => (
                <li
                    className={clsx(styles.streak__item, { [styles[`streak__item--filled`]]: item < streak })}
                    key={item}
                />
            ))}
        </ul>
    );
}
