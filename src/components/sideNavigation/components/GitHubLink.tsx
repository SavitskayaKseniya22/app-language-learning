import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ScreenSize } from "../../../interfaces";

const StyledGitHubLink = styled(Link)`
    display: block;
    padding: 0.5rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 101;
    color: black;
    font-size: 2rem;

    @media ${ScreenSize.TABLET} {
        color: white;
    }
`;

function GitHubLink() {
    return (
        <StyledGitHubLink to="https://github.com/SavitskayaKseniya22" target="blank" title="Developer's GitHub">
            <i className="fa-brands fa-github" />
        </StyledGitHubLink>
    );
}

export default GitHubLink;
