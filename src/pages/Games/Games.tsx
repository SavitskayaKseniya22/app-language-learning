import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const StyledGameList = styled("ul")`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    align-items: center;
    justify-content: center;
    flex-grow: 2;
`;

export const StyledGameItem = styled("li")`
    border-radius: 0.5rem;
    border: 2px solid rgb(231, 111, 81);
    width: 268px;
    height: 100px;

    a {
        display: block;
        width: 100%;
        height: 100%;
        padding: 1rem;
    }
`;

function Games() {
    return (
        <main className="main">
            <h2 className="main__title_main">Games</h2>
            <StyledGameList>
                <StyledGameItem>
                    <Link to="sprint">
                        <h4>Sprint</h4>
                    </Link>
                </StyledGameItem>
                <StyledGameItem>
                    <Link to="constructor">
                        <h4>Constructor</h4>
                    </Link>
                </StyledGameItem>
                <StyledGameItem>
                    <Link to="audiocall">
                        <h4>Audiocall</h4>
                    </Link>
                </StyledGameItem>
                <StyledGameItem>
                    <Link to="puzzles">
                        <h4>Puzzles</h4>
                    </Link>
                </StyledGameItem>
            </StyledGameList>
        </main>
    );
}

export default Games;
