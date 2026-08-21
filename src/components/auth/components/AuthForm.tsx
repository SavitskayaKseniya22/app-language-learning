import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Id, toast } from "react-toastify";
import { BasicUserCredentials } from "../../../interfaces";

export const passwordPattern =
    /(?=.*[+-_@$!%*?&#.,;:[\]{}])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[0-9a-zA-Z+-_@$!%*?&#.,;:[\]{}]{8,}/g;

export const StyledAuthForm = styled("form")`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    flex-grow: 222;
`;

export const StyledInput = styled("input")`
    width: 100%;
    border: none;
    background-color: rgb(244, 162, 97);
    text-align: center;
    font-size: 1.25rem;
    padding: 0.5rem 1rem;
`;

function AuthForm({ onSubmit }: { onSubmit: (data: BasicUserCredentials) => void }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<BasicUserCredentials>({
        criteriaMode: "all",
    });

    const emailToastId = React.useRef<null | Id>(null);
    const passwordToastId = React.useRef<null | Id>(null);

    useEffect(() => {
        if (emailToastId.current) {
            toast.dismiss(emailToastId.current);
        }

        if (errors.email) {
            emailToastId.current = toast.warn(errors.email.message);
        }
    }, [errors.email]);

    useEffect(() => {
        if (passwordToastId.current) {
            toast.dismiss(passwordToastId.current);
        }

        if (errors.password) {
            passwordToastId.current = toast.warn(errors.password.message);
        }
    }, [errors.password]);

    return (
        <StyledAuthForm onSubmit={handleSubmit(onSubmit)} noValidate>
            <StyledInput
                {...register("email", {
                    required: "Email is required.",
                })}
                type="email"
                placeholder="email"
            />
            <StyledInput
                {...register("password", {
                    required: "Password is required.",
                    pattern: {
                        value: passwordPattern,
                        message:
                            "The password must contain at least 8 characters, at least one letter, one capital letter, one number and one special character from `+-_@$!%*?&#.,;:[]{}`",
                    },
                })}
                type="password"
                placeholder="password"
                title="The password must contain at least 8 characters, at least one letter, one capital letter, one number and one special character from `+-_@$!%*?&#.,;:[]{}`"
            />

            <button type="submit">Enter</button>
        </StyledAuthForm>
    );
}

export default AuthForm;
