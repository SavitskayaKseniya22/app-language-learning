import React from "react";
import styled from "styled-components";
import MainNavigation from "./components/MainNavigation";
import { ScreenSize } from "../../interfaces";

const StyledSidePanel = styled("nav")`
    background-color: rgba(38, 70, 83);
    position: sticky;
    top: 0;
    z-index: 100;
    min-width: 180px;

    @media ${ScreenSize.TABLET} {
        height: 100vh;
    }
`;

function SidePanel() {
    return (
        <StyledSidePanel>
            <MainNavigation />
        </StyledSidePanel>
    );
}

export default SidePanel;
