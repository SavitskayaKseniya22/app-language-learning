import { useState } from "react";
import styled from "styled-components";
import SignIn from "../sign-in/sign-in";
import SignUp from "../sign-up/sign-up";

const StyledAuthContainer = styled("div")`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

function Auth() {
    const [authFormType, setAuthFormType] = useState<"signin" | "signup">("signin");

    return (
        <StyledAuthContainer>
            {authFormType === "signin" ? (
                <>
                    <SignIn />
                    <button
                        type="button"
                        onClick={() => {
                            setAuthFormType("signup");
                        }}>
                        Make new user
                    </button>
                </>
            ) : (
                <>
                    <SignUp />
                    <button
                        type="button"
                        onClick={() => {
                            setAuthFormType("signin");
                        }}>
                        Log in if you are already registered
                    </button>
                </>
            )}
        </StyledAuthContainer>
    );
}

export default Auth;
