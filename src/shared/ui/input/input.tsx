import type { ReactNode } from "react";
import { forwardRef, useId } from "react";
import styles from "./input.module.scss";
import clsx from "clsx";

interface LabeledInputProperties extends React.ComponentProps<"input"> {
    label?: string | ReactNode;
    errorMessage?: string;
    type?: Extract<React.HTMLInputTypeAttribute, "text" | "password" | "number" | "email"> | undefined;
    isRequired?: boolean;
    inputSize?: "medium" | "small";
    isWithErrorText?: boolean;
    clearButtonProps?: React.ComponentProps<"button">;
}

const Input = forwardRef<HTMLInputElement, LabeledInputProperties>(function Input(
    {
        label,
        isRequired = false,
        inputSize = "medium",
        errorMessage,
        isWithErrorText = true,
        clearButtonProps,
        className,
        ...properties
    },
    reference,
) {
    const generatedId = useId();
    const inputId = properties.id ?? (label ? generatedId : undefined);
    return (
        <div className={clsx(styles.input, className)}>
            {label ? (
                isRequired ? (
                    <label htmlFor={inputId} className={styles.input__label}>
                        {label}
                        <span className={styles.input__required}>*обязательно</span>
                    </label>
                ) : (
                    <label htmlFor={inputId} className={styles.input__label}>
                        {label}
                    </label>
                )
            ) : undefined}

            <div
                className={clsx(styles.input__container, styles[`input__container--${inputSize}`], {
                    [styles["input__container--invalid"]]: errorMessage,
                })}>
                <input ref={reference} {...properties} id={inputId} className={clsx(styles.input__field)} />
                {clearButtonProps && (
                    <button
                        type="button"
                        aria-label="Очистить поле"
                        {...clearButtonProps}
                        className={clsx(styles.input__clear, clearButtonProps.className)}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                )}
            </div>

            {isWithErrorText && errorMessage && errorMessage.trim().length > 0 && (
                <p className={styles.input__error}>{errorMessage}</p>
            )}
        </div>
    );
});

export default Input;
