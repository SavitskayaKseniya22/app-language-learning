import React, { useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSignInMutation, useSignUpMutation } from "../../../store/auth/authApi";
import ModalContext from "../../modal/ModalContext";
import { BasicUserCredentials } from "../../../interfaces";
import AuthForm from "./AuthForm";
import { useCreateUserDataMutation } from "../../../store/userWordsApi";

function SignUp() {
    const [signUp] = useSignUpMutation();
    const [signIn] = useSignInMutation();
    const { setContent } = useContext(ModalContext);
    const navigate = useNavigate();
    const [createUserData] = useCreateUserDataMutation();

    const onSubmit = useCallback(
        (data: BasicUserCredentials) => {
            const { email, password } = data;
            signUp(data)
                .unwrap()
                .then(res => {
                    const { localId, idToken } = res;
                    createUserData({ userId: localId, tokenId: idToken });
                })
                .then(() => {
                    signIn({ email, password });
                })

                .then(() => {
                    setContent(null);
                    navigate("/profile");
                })
                .catch(err => {
                    if ("data" in err) {
                        toast.error(err.data);
                    }
                });
        },
        [createUserData, navigate, setContent, signIn, signUp],
    );

    return <AuthForm onSubmit={onSubmit} />;
}

export default SignUp;
