import type React from "react";
import styled from "styled-components";

enum ScreenSize {
    MOBILE = "(min-width: 320px)",
    TABLET = "(min-width: 768px)",
    LAPTOPS = "(min-width: 1024px)",
    DESKTOP = "(min-width: 1920px)",
}

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
