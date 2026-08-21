import React, { useContext } from "react";
import styled from "styled-components";
import ModalContext from "../../modal/ModalContext";
import Auth from "../../auth/Auth";
import { ScreenSize } from "../../../interfaces";

const StyledSignInControl = styled("button")`
    padding: 0.5rem;
    background-color: white;
    border-radius: 0 0 0.5rem 0.5rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    width: 100%;

    @media ${ScreenSize.TABLET} {
        border-radius: 0.5rem 0 0 0.5rem;
    }
`;

function SignInControl() {
    const { setContent } = useContext(ModalContext);

    return (
        <StyledSignInControl
            type="button"
            onClick={() => {
                setContent(<Auth />);
            }}>
            <i className="fa-solid fa-user" />
            <span className="nav__title">Sign in</span>
        </StyledSignInControl>
    );
}

export default SignInControl;
