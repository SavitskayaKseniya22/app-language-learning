import styled from "styled-components";
import { ScreenSize } from "../interfaces";

export const StyledMain = styled("main")`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    flex-grow: 2;
    min-width: 320px;
    align-items: center;
    position: relative;
    justify-content: space-between;

    @media ${ScreenSize.TABLET} {
        border-left: 0.5rem solid white;
    }

    .main__title_main {
        align-self: flex-start;
        color: rgba(38, 70, 83);
    }
`;

export const StyledGameContainer = styled("div")`
    display: flex;
    flex-direction: column;
    flex-grow: 2;
    justify-content: space-around;
    text-align: center;
    gap: 1rem;
    width: 100%;

    @media ${ScreenSize.TABLET} {
        width: 90%;
    }
    @media ${ScreenSize.LAPTOPS} {
        width: 70%;
    }
    @media ${ScreenSize.LAPTOPL} {
        width: 50%;
    }
`;
