import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./timer.module.scss";

type TimerProperties = {
    duration: number;
    doAfterTimer: () => void;
};

export default function Timer({ duration, doAfterTimer }: TimerProperties) {
    const [timer, setTimer] = useState(duration);

    const callbackReference = useRef(doAfterTimer);
    const hasFinishedReference = useRef(false);

    useEffect(() => {
        callbackReference.current = doAfterTimer;
    }, [doAfterTimer]);

    useEffect(() => {
        if (timer === 0) return;
        const timeoutId = setTimeout(() => {
            setTimer(previousTimer => Math.max(0, previousTimer - 1));
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [timer]);

    useEffect(() => {
        if (timer === 0 && !hasFinishedReference.current) {
            hasFinishedReference.current = true;
            callbackReference.current();
        }
    }, [timer]);

    return (
        <div className={styles.timer}>
            <h3 className={styles.timer__content}>
                Time:{" "}
                <span
                    className={clsx(styles.timer__time, {
                        [styles["timer__time--ending"]]: timer < 10,
                    })}>
                    {timer}
                </span>
            </h3>
        </div>
    );
}
