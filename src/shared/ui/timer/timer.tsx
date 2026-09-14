import { useEffect, useRef, useState } from "react";
import styles from "./timer.module.scss";
import clsx from "clsx";
export default function Timer({ duration, doAfterTimer }: { duration: number; doAfterTimer: () => void }) {
    const [timer, setTimer] = useState(duration);

    const intervalReference = useRef<number | null>(null);

    useEffect(() => {
        if (timer === 0) {
            if (intervalReference.current) {
                clearInterval(intervalReference.current);
            }
            doAfterTimer();
        }
    }, [doAfterTimer, timer]);

    useEffect(() => {
        intervalReference.current = setInterval(() => {
            setTimer(seconds => seconds - 1);
        }, 1000);

        return () => {
            if (intervalReference.current) {
                clearInterval(intervalReference.current);
            }
        };
    }, []);

    return (
        <div className={styles.timer}>
            <h3 className={styles.timer__content}>
                Time:{" "}
                <span className={clsx(styles.timer__time, { [styles["timer__time--ending"]]: timer < 10 })}>
                    {timer}
                </span>
            </h3>
        </div>
    );
}
