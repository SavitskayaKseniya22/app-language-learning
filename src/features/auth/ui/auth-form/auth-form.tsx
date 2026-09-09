import type { FieldErrors, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { BasicUserCredentials } from "@shared/types/interfaces";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import styles from "./form.module.scss";

export default function AuthForm({ onSubmit }: { onSubmit: SubmitHandler<BasicUserCredentials> }) {
    const { register, handleSubmit } = useForm<BasicUserCredentials>();

    const onInvalid = (errors: FieldErrors<BasicUserCredentials>) => {
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
                    required: "Email is required",
                })}
                type="email"
                placeholder="email"
            />

            <Input
                {...register("password", {
                    required: "Password is required",
                })}
                type="password"
                placeholder="password"
            />

            <Button type="submit">Enter</Button>
        </form>
    );
}
