import React, { useEffect } from "react";
import styled from "styled-components";

const StyledChoiceList = styled("div")`
    display: flex;
    padding: 1rem;
    gap: 1rem;
    justify-content: center;
    align-items: center;
`;

const StyledChoiceButton = styled("button")<{ $type: "left" | "right" }>`
    color: white;
    padding: 1rem 2rem;
    font-size: 1.5rem;
    position: relative;
    background-color: ${props => (props.$type === "left" ? "rgb(231, 111, 81)" : "rgb(42, 157, 143)")};

    .icon {
        position: absolute;
        top: 0.5rem;
        font-size: 1rem;
        opacity: 0.5;
        ${props => props.$type === "left" && "left: 0.5rem;"}
        ${props => props.$type === "right" && "right: 0.5rem;"}
    }
`;

function SprintRound({ handleClick }: { handleClick: (value: string) => void }) {
    const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { value } = e.target as HTMLButtonElement;
        handleClick(value);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "ArrowLeft") {
                e.preventDefault();
                handleClick("false");
            } else if (e.code === "ArrowRight") {
                e.preventDefault();
                handleClick("true");
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleClick]);

    return (
        <StyledChoiceList>
            <StyledChoiceButton $type="left" className="choices_false" type="button" value="false" onClick={onClick}>
                false
                <i className="fa-solid fa-arrow-left icon" />
            </StyledChoiceButton>
            <StyledChoiceButton $type="right" className="choices_true" type="button" value="true" onClick={onClick}>
                true
                <i className="fa-solid fa-arrow-right icon" />
            </StyledChoiceButton>
        </StyledChoiceList>
    );
}

export default SprintRound;
