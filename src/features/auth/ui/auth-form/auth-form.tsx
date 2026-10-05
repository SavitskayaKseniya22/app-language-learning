import type { FieldErrors, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import styles from "./form.module.scss";
import type { UserCredentials } from "../../model/types";

export default function AuthForm({ onSubmit }: { onSubmit: SubmitHandler<UserCredentials> }) {
    const { register, handleSubmit } = useForm<UserCredentials>();

    const onInvalid = (errors: FieldErrors<UserCredentials>) => {
        if (errors.email) {
            toast.warn(errors.email.message);
        }

        if (errors.password) {
            toast.warn(errors.password.message);
        }
    };

    return (
        <form
            onSubmit={event => {
                void handleSubmit(onSubmit, onInvalid)(event);
            }}
            noValidate
            className={styles.form}>
            <Input
                {...register("email", {
                    required: "Укажите электронную почту",
                })}
                type="email"
                aria-label="Электронная почта"
                placeholder="Электронная почта"
            />

            <Input
                {...register("password", {
                    required: "Укажите пароль",
                })}
                type="password"
                aria-label="Пароль"
                placeholder="Пароль"
            />

            <Button type="submit">Продолжить</Button>
        </form>
    );
}
