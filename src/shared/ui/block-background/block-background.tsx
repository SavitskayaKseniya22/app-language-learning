import type { ReactNode } from "react";
import styles from "./block-background.module.scss";

export default function BlockBackground({ children }: { children: ReactNode }) {
    return (
        <div className={styles.block}>
            <div className={styles.block__content}>{children}</div>
        </div>
    );
}
