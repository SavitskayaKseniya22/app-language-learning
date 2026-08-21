import React from "react";
import styled from "styled-components";
import { makeEmptyArrayWithIds } from "../../../utils";
import { ProgressType } from "../../../interfaces";

const StyledStreak = styled("ul")`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    gap: 1.5rem;
`;

const StyledStreakItem = styled("li")<{ $type: "fullfilled" | "empty" }>`
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-color: ${props => (props.$type === "fullfilled" ? "rgb(244, 162, 97)" : "rgba(233, 197, 106, 0.5)")};
`;

function Streak({ streak, total }: ProgressType) {
    return (
        <StyledStreak>
            {makeEmptyArrayWithIds(total).map((item, i) => (
                <StyledStreakItem key={item.key} $type={i < streak ? "fullfilled" : "empty"} />
            ))}
        </StyledStreak>
    );
}

export default Streak;
