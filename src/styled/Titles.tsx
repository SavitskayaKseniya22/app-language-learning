import { css } from "styled-components";
import { ScreenSize } from "../interfaces";

const titles = css`
    h1 {
        font-size: 3rem;
        color: rgb(231, 111, 81);
        margin: 1rem 0;
    }

    h2 {
        font-size: 2rem;
        color: rgb(42, 157, 143);
        margin: 1rem 0;
    }

    h3 {
        font-size: 1.5rem;
        margin: 0.5rem 0;
        color: rgb(231, 111, 81);
    }

    h4 {
        font-size: 1.25rem;
        font-weight: 500;
        margin: 0.25rem 0;
        color: rgb(42, 157, 143);
    }

    h5 {
        font-size: 1rem;
        font-weight: 300;
        margin: 0.125rem 0;
    }

    @media ${ScreenSize.LAPTOPL} {
        h1 {
            font-size: 3.5rem;
        }

        h2 {
            font-size: 2.5rem;
        }

        h3 {
            font-size: 2rem;
        }

        h4 {
            font-size: 1.5rem;
        }

        h5 {
            font-size: 1.25rem;
        }
    }
`;

export default titles;
