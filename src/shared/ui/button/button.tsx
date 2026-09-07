import type { ComponentProps } from "react";
import { Link, type LinkProps } from "react-router-dom";
import clsx from "clsx";

import styles from "./button.module.scss";

type View = "primary" | "secondary" | "transparent";
export type SizeType = "small" | "medium" | "big";

interface VariantProperties {
    view?: View;
    size?: SizeType;
}

function getButtonClasses(view: View = "primary", size: SizeType = "medium", className?: string) {
    return clsx(styles.button, styles[`button_${view}`], styles[`button_${size}`], className);
}

type ButtonProperties = ComponentProps<"button"> & VariantProperties;

export function Button({ className, children, view = "primary", size = "medium", ...properties }: ButtonProperties) {
    return (
        <button type="button" {...properties} className={getButtonClasses(view, size, className)}>
            {children}
        </button>
    );
}

type ButtonLinkProperties = LinkProps &
    VariantProperties & {
        disabled?: boolean;
    };

export function CustomLinkAsButton({
    className,
    children,
    view = "primary",
    size = "medium",
    disabled = false,
    ...properties
}: ButtonLinkProperties) {
    return (
        <Link
            {...properties}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : properties.tabIndex}

            className={getButtonClasses(view, size, className)}>
            {children}
        </Link>
    );
}

type AnchorProperties = ComponentProps<"a"> &
    VariantProperties & {
        disabled?: boolean;
    };

export function CustomAnchorLinkAsButton({
    className,
    children,
    view = "primary",
    size = "medium",
    disabled = false,
    ...properties
}: AnchorProperties) {
    return (
        <a
            {...properties}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : properties.tabIndex}
            className={getButtonClasses(view, size, className)}>
            {children}
        </a>
    );
}
