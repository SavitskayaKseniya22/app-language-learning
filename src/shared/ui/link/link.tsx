import type { ComponentProps } from "react";
import { Link, type LinkProps } from "react-router-dom";
import clsx from "clsx";
import styles from "./link.module.scss";

type View = "primary" | "secondary";

interface VariantProperties {
    view?: View;
}

function getClasses(view: View = "primary", className?: string) {
    return clsx(styles.link, styles[`link_${view}`], className);
}

type CustomLinkProperties = LinkProps &
    VariantProperties & {
        disabled?: boolean;
    };

export function CustomLink({
    className,
    children,
    view = "primary",
    disabled = false,
    ...properties
}: CustomLinkProperties) {
    return (
        <Link
            {...properties}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : properties.tabIndex}

            className={getClasses(view, className)}>
            {children}
        </Link>
    );
}

type AnchorProperties = ComponentProps<"a"> &
    VariantProperties & {
        disabled?: boolean;
    };

export function CustomAnchorLink({
    className,
    children,
    view = "primary",
    disabled = false,
    ...properties
}: AnchorProperties) {
    return (
        <a
            {...properties}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : properties.tabIndex}

            className={getClasses(view, className)}>
            {children}
        </a>
    );
}

type LinkButtonProperties = ComponentProps<"button"> & VariantProperties;

export function CustomButtonAsLink({ className, children, view = "primary", ...properties }: LinkButtonProperties) {
    return (
        <button type="button" {...properties} className={getClasses(view, className)}>
            {children}
        </button>
    );
}
