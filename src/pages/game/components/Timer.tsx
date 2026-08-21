import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export const StyledTimer = styled("div")`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    border-radius: 50%;
    border: 3px solid white;
    width: 3rem;
    height: 3rem;
    font-size: 1rem;
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    color: rgb(38, 70, 83);
`;

function Timer({ duration, doAfterTimer }: { duration: number; doAfterTimer: () => void }) {
    const [timer, setTimer] = useState(duration);

    const intervalRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (timer === 0) {
            clearInterval(intervalRef.current);
            doAfterTimer();
        }
    }, [doAfterTimer, timer]);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimer(seconds => seconds - 1);
        }, 1000);

        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <StyledTimer>
            <b>{timer}</b>
        </StyledTimer>
    );
}

export default Timer;
