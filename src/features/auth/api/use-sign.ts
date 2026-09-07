import ModalContext from "@/shared/ui/modal/modal-context";
import { supabase } from "@/shared/api/supabase/config";
import type { BasicUserCredentials } from "@/shared/types/interfaces";
import { useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function useSign() {
    const { setContent } = useContext(ModalContext);
    const navigate = useNavigate();

    const onSignIn = useCallback(
        async (data: BasicUserCredentials) => {
            const { error } = await supabase.auth.signInWithPassword(data);

            if (error) {
                toast.error(error.message);
                return;
            }

            setContent(null);
            void navigate("/profile");
        },
        [navigate, setContent],
    );

    const onSignUp = useCallback(
        async (data: BasicUserCredentials) => {
            const { error } = await supabase.auth.signUp(data);

            if (error) {
                toast.error(error.message);
                return;
            }

            setContent(null);
            void navigate("/profile");
        },
        [navigate, setContent],
    );

    return { onSignIn, onSignUp };
}
