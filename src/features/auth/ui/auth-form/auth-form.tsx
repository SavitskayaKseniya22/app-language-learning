import React, { useEffect } from "react";
import type { FieldErrors, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import type { Id } from "react-toastify";
import { toast } from "react-toastify";
import type { BasicUserCredentials } from "@shared/types/interfaces";

const StyledAuthForm = styled("form")`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    flex-grow: 222;
`;

const StyledInput = styled("input")`
    width: 100%;
    border: none;
    background-color: rgb(244, 162, 97);
    text-align: center;
    font-size: 1.25rem;
    padding: 0.5rem 1rem;
`;

function AuthForm({ onSubmit }: { onSubmit: (data: BasicUserCredentials) => void }) {
    const { register, handleSubmit } = useForm<BasicUserCredentials>();

    const onSubmitGlobal: SubmitHandler<BasicUserCredentials> = data => {
        onSubmit(data);
    };

    const onInvalid = (errors: FieldErrors<BasicUserCredentials>) => {
        console.log(errors);
        if (errors.email) {
            toast.warn(errors.email.message);
        }
        if (errors.password) {
            toast.warn(errors.password.message);
        }
    };

    return (
        <StyledAuthForm onSubmit={event => void handleSubmit(onSubmitGlobal, onInvalid)(event)} noValidate>
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
                })}
                type="password"
                placeholder="password"
            />

            <button type="submit">Enter</button>
        </StyledAuthForm>
    );
}

export default AuthForm;
