import React from "react";
import styled from "styled-components";
import { StyledMain } from "../../styled/SharedStyles";

export const StyledErrorPage = styled("div")`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 2;
`;

export enum ErrorType {
    ERROR,
    PAGENOTFOUND,
}

function ErrorPage({ type }: { type: ErrorType }) {
    return (
        <StyledMain>
            <h2 className="main__title_main">{type === ErrorType.ERROR ? "Something went wrong" : "Nothing found"}</h2>
            <StyledErrorPage>
                <h3>Please reload the page or return to the Main Page.</h3>
            </StyledErrorPage>
        </StyledMain>
    );
}

export default ErrorPage;
