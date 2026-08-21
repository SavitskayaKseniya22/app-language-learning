import React from "react";
import styled from "styled-components";
import { ScreenSize } from "../../../interfaces";
import { resetUser } from "../../../store/auth/authSlice";
import { useAppDispatch } from "../../../store/store";

const StyledSignOutControl = styled("button")`
    display: none;

    @media ${ScreenSize.TABLET} {
        padding: 0.5rem;
        background-color: white;
        border-radius: 0 0 0.5rem 0.5rem;
        display: flex;
        gap: 1rem;
        align-items: center;
        width: 100%;
        color: rgb(42, 157, 143);
        border-radius: 0.5rem 0 0 0.5rem;
    }
`;

function SignOutControl() {
    const dispatch = useAppDispatch();

    return (
        <StyledSignOutControl
            type="button"
            onClick={() => {
                dispatch(resetUser());
            }}>
            <i className="fa-solid fa-arrow-right-from-bracket" />
            <span>Sign Out</span>
        </StyledSignOutControl>
    );
}

export default SignOutControl;
