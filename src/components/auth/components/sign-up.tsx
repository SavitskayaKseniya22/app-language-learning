import { useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSignInMutation, useSignUpMutation } from "../../../store/auth/auth-api";
import ModalContext from "../../modal/modal-context";
import type { BasicUserCredentials } from "../../../interfaces";
import AuthForm from "./auth-form";
import { useCreateUserDataMutation } from "../../../store/user-words-api";

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
                .then(result => {
                    const { localId, idToken } = result;
                    createUserData({ userId: localId, tokenId: idToken });
                })
                .then(() => {
                    signIn({ email, password });
                })

                .then(() => {
                    setContent(null);
                    navigate("/profile");
                })
                .catch(error => {
                    if ("data" in error) {
                        toast.error(error.data);
                    }
                });
        },
        [createUserData, navigate, setContent, signIn, signUp],
    );

    return <AuthForm onSubmit={onSubmit} />;
}

export default SignUp;
