import { useState } from "react";
import { Button } from "@/shared/ui/button";
import styles from "./auth.module.scss";
import AuthForm from "../auth-form/auth-form";
import useSign from "../../api/use-sign";

function Auth() {
    const [authFormType, setAuthFormType] = useState<"signin" | "signup">("signin");
    const { onSignIn, onSignUp } = useSign();

    return (
        <div className={styles.auth}>
            {authFormType === "signin" ? (
                <>
                    <h2>Sign in</h2>
                    <AuthForm onSubmit={onSignIn} />
                    <Button
                        type="button"
                        view="transparent"
                        onClick={() => {
                            setAuthFormType("signup");
                        }}>
                        Create new user
                    </Button>
                </>
            ) : (
                <>
                    <h2>Registration</h2>
                    <AuthForm onSubmit={onSignUp} />
                    <Button
                        type="button"
                        view="transparent"
                        onClick={() => {
                            setAuthFormType("signin");
                        }}>
                        Sign in if registered
                    </Button>
                </>
            )}
        </div>
    );
}

export default Auth;
