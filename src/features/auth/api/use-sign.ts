import { ModalContext } from "@/shared/ui/modal";
import { useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "@/shared/api";
import type { AuthError } from "@supabase/supabase-js";
import type { UserCredentials } from "../model/types";

function getAuthErrorMessage(error: AuthError) {
    switch (error.code) {
        case "invalid_credentials": {
            return "Неверная электронная почта или пароль.";
        }
        case "email_not_confirmed": {
            return "Подтвердите электронную почту по ссылке в письме.";
        }
        case "user_already_exists":
        case "email_exists": {
            return "Аккаунт с этой электронной почтой уже существует.";
        }
        case "weak_password": {
            return "Пароль слишком простой. Выберите более надёжный пароль.";
        }
        case "over_request_rate_limit":
        case "over_email_send_rate_limit": {
            return "Слишком много попыток. Попробуйте позже.";
        }
        default: {
            return "Не удалось выполнить запрос. Проверьте подключение и попробуйте снова.";
        }
    }
}

export default function useSign() {
    const { setContent } = useContext(ModalContext);
    const navigate = useNavigate();

    const onSignIn = useCallback(
        async (data: UserCredentials) => {
            const { error } = await supabase.auth.signInWithPassword(data);

            if (error) {
                toast.error(getAuthErrorMessage(error));
                return;
            }

            setContent(null);
            void navigate("/profile");
        },
        [navigate, setContent],
    );

    const onSignUp = useCallback(
        async (data: UserCredentials) => {
            const { data: signUpData, error } = await supabase.auth.signUp(data);

            if (error) {
                toast.error(getAuthErrorMessage(error));
                return;
            }

            setContent(null);
            if (signUpData.session) {
                void navigate("/profile");
            } else {
                toast.info("Перед входом подтвердите регистрацию по ссылке в письме.");
            }
        },
        [navigate, setContent],
    );

    return { onSignIn, onSignUp };
}
