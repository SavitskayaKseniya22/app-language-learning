import React, { useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSignInMutation } from "../../../store/auth/authApi";
import { BasicUserCredentials } from "../../../interfaces";
import ModalContext from "../../modal/ModalContext";
import AuthForm from "./AuthForm";

function SignIn() {
    const [signIn] = useSignInMutation();
    const { setContent } = useContext(ModalContext);
    const navigate = useNavigate();

    const onSubmit = useCallback(
        (data: BasicUserCredentials) => {
            signIn(data)
                .unwrap()
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
        [navigate, setContent, signIn],
    );

    return <AuthForm onSubmit={onSubmit} />;
}

export default SignIn;
