import type { ReactNode } from "react";
import styles from "./game-info-container.module.scss";
import clsx from "clsx";

export default function GameInfoContainer({
    children,
    className,
    disabled,
}: {
    children: ReactNode;
    className?: string;
    disabled?: boolean;
}) {
    if (disabled !== undefined) {
        return (
            <fieldset className={clsx(styles.container, className)} disabled={disabled}>
                {children}
            </fieldset>
        );
    }
    return <div className={clsx(styles.container, className)}>{children}</div>;
}
