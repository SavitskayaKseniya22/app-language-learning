import type { ReactNode } from "react";
import styles from "./game-info-container.module.scss";
import clsx from "clsx";

export default function GameInfoContainer({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={clsx(styles.container, className)}>{children}</div>;
}
