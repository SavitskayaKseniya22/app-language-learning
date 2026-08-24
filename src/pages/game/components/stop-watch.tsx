import { useEffect, useRef, useState } from "react";
import { StyledTimer } from "./timer";
import { getParcedTime, makeLineFromParcedTime } from "../../../shared/lib/utilities";

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
            <b>{makeLineFromParcedTime(getParcedTime({ time }))}</b>
        </StyledTimer>
    );
}

export default StopWatch;
