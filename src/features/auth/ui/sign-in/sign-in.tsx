import { useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSignInMutation } from "../../api/auth-api";
import type { BasicUserCredentials } from "../../../../shared/types/interfaces";
import ModalContext from "../../../../components/modal/modal-context";
import AuthForm from "@features/auth/ui/auth-form/auth-form";

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
                .catch(error => {
                    if ("data" in error) {
                        toast.error(error.data);
                    }
                });
        },
        [navigate, setContent, signIn],
    );

    return <AuthForm onSubmit={onSubmit} />;
}

export default SignIn;
