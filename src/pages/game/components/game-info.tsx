import type React from "react";
import styled from "styled-components";
import { ScreenSize } from "../../../interfaces";

const StyledGameInfo = styled("div")`
    display: flex;
    width: 100%;
    margin-bottom: auto;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    @media ${ScreenSize.LAPTOPS} {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
    }
`;

function GameInfo({ children }: { children: React.ReactNode }) {
    return <StyledGameInfo>{children}</StyledGameInfo>;
}

export default GameInfo;
