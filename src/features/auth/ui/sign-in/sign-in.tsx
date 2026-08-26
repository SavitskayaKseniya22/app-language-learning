import { useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { BasicUserCredentials } from "../../../../shared/types/interfaces";
import ModalContext from "../../../../components/modal/modal-context";
import AuthForm from "@features/auth/ui/auth-form/auth-form";
import { supabase } from "@/shared/api/supabase/config";

function SignIn() {
    const { setContent } = useContext(ModalContext);
    const navigate = useNavigate();

    const onSubmit = useCallback(
        (data: BasicUserCredentials) => {
            supabase.auth
                .signInWithPassword(data)
                .then(() => {
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

export default SignIn;
