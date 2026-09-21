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
        const intervalId = setInterval(() => {
            setTimer(previousTimer => {
                if (previousTimer <= 1) {
                    clearInterval(intervalId);

                    if (!hasFinishedReference.current) {
                        hasFinishedReference.current = true;
                        callbackReference.current();
                    }

                    return 0;
                }

                return previousTimer - 1;
            });
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

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
