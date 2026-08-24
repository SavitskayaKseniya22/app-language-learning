import type { ReactNode } from "react";
import styled from "styled-components";
import { getPercent, getResultMessage } from "../../../utilities";

const StyledGameResultInfo = styled("div")`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 0.5rem;

    width: 100%;
    z-index: 5;
    padding: 1rem;
    text-align: center;

    .result__detailed {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
`;

function GameResultInfo({
    correct,
    wrong,
    total,
    children,
}: {
    correct: number;
    wrong: number;
    total: number;
    children?: ReactNode;
}) {
    const percent = getPercent(correct + wrong, correct);

    const message = getResultMessage(percent);

    return (
        <StyledGameResultInfo>
            <h3>Points gained: {total}</h3>
            <h4>{message}</h4>
            <h5>{`${percent}% correct answers`}</h5>
            {children}
        </StyledGameResultInfo>
    );
}

export default GameResultInfo;
