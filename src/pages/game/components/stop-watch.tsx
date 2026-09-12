import { useEffect, useRef, useState } from "react";
import { StyledTimer } from "./timer";
import { makeLineFromParcedTime } from "@/shared/lib/dates";

function StopWatch({ func }: { func: (value: number) => void }) {
    const [time, setTime] = useState(0);

    const intervalReference = useRef<NodeJS.Timeout>();

    useEffect(() => {
        func(time);
    }, [func, time]);

    useEffect(() => {
        intervalReference.current = setInterval(() => {
            setTime(seconds => seconds + 1);
        }, 1000);

        return () => {
            clearInterval(intervalReference.current);
        };
    }, []);

    return (
        <StyledTimer>
            <b>{makeLineFromParcedTime({ time })}</b>
        </StyledTimer>
    );
}

export default StopWatch;
