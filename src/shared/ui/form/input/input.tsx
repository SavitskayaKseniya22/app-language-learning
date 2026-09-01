import type { ReactNode } from "react";
import { forwardRef } from "react";
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
    return (
        <label className={clsx(styles.input, className)}>
            {label ? (
                isRequired ? (
                    <div className={styles.input__label}>
                        {label}
                        <p className={styles.input__label_required}>*required</p>
                    </div>
                ) : (
                    <div className={styles.input__label}>{label}</div>
                )
            ) : undefined}

            <div
                className={clsx(styles.input__container, styles[`input__container_${inputSize}`], {
                    [styles.input__container_invalid]: errorMessage,
                })}>
                <input ref={reference} {...properties} className={clsx(styles.input__field)} />
                {clearButtonProps && (
                    <button
                        type="button"
                        {...clearButtonProps}
                        className={clsx(styles.input__btn, styles.input__btn, clearButtonProps.className)}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                )}
            </div>

            {isWithErrorText && errorMessage && errorMessage.trim().length > 0 && (
                <p className={styles.input__error}>{errorMessage}</p>
            )}
        </label>
    );
});

export default Input;
