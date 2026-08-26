import { useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ModalContext from "../../../../components/modal/modal-context";
import type { BasicUserCredentials } from "../../../../shared/types/interfaces";
import AuthForm from "../auth-form/auth-form";
import { supabase } from "@/shared/api/supabase/config";

function SignUp() {
    const { setContent } = useContext(ModalContext);
    const navigate = useNavigate();

    const onSubmit = useCallback(
        (data: BasicUserCredentials) => {
            supabase.auth
                .signUp(data)

                .then(result => {
                    if (result.error) {
                        throw result.error;
                    }
                    setContent(null);
                    void navigate("/profile");
                })
                .catch(error => {
                    if (error instanceof Error) {
                        toast.error(error.message);
                    }
                });
        },
        [navigate, setContent],
    );

    return <AuthForm onSubmit={onSubmit} />;
}

export default SignUp;
