import type React from "react";
import { useEffect } from "react";
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
    background-color: ${properties => (properties.$type === "left" ? "rgb(231, 111, 81)" : "rgb(42, 157, 143)")};

    .icon {
        position: absolute;
        top: 0.5rem;
        font-size: 1rem;
        opacity: 0.5;
        ${properties => properties.$type === "left" && "left: 0.5rem;"}
        ${properties => properties.$type === "right" && "right: 0.5rem;"}
    }
`;

function SprintRound({ handleClick }: { handleClick: (value: string) => void }) {
    const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { value } = event.target as HTMLButtonElement;
        handleClick(value);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === "ArrowLeft") {
                event.preventDefault();
                handleClick("false");
            } else if (event.code === "ArrowRight") {
                event.preventDefault();
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
