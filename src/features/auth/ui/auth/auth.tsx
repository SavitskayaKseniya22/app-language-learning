import { useContext } from "react";
import { Button } from "@/shared/ui/button";
import styles from "./auth.module.scss";
import AuthForm from "../auth-form/auth-form";
import useSign from "../../api/use-sign";
import { ModalContext } from "@/shared/ui/modal";

export default function Auth({ authFormType = "signin" }: { authFormType?: "signin" | "signup" }) {
    const { onSignIn, onSignUp } = useSign();
    const { setContent } = useContext(ModalContext);

    return (
        <div className={styles.auth}>
            {authFormType === "signin" ? (
                <>
                    <AuthForm onSubmit={onSignIn} />
                    <Button
                        type="button"
                        view="transparent"
                        onClick={() => {
                            setContent({ body: <Auth authFormType={"signup"} />, title: "Registration" });
                        }}>
                        Create new user
                    </Button>
                </>
            ) : (
                <>
                    <AuthForm onSubmit={onSignUp} />
                    <Button
                        type="button"
                        view="transparent"
                        onClick={() => {
                            setContent({ body: <Auth authFormType={"signin"} />, title: "Sign in" });
                        }}>
                        Sign in if registered
                    </Button>
                </>
            )}
        </div>
    );
}
