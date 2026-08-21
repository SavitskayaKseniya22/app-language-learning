import React, { useEffect, useRef, useState } from "react";
import { StyledTimer } from "./Timer";
import { getParcedTime, makeLineFromParcedTime } from "../../../utils";

function StopWatch({ func }: { func: (value: number) => void }) {
    const [time, setTime] = useState(0);

    const intervalRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        func(time);
    }, [func, time]);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTime(seconds => seconds + 1);
        }, 1000);

        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <StyledTimer>
            <b>{makeLineFromParcedTime(getParcedTime({ time }))}</b>
        </StyledTimer>
    );
}

export default StopWatch;
