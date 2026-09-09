import type { ReactNode } from "react";
import styles from "./badge.module.scss";
import clsx from "clsx";
import type { SizeType } from "../button/button";

export default function Badge({ size = "medium", children }: { size?: SizeType; children: ReactNode }) {
    return <div className={clsx(styles.badge, styles[`badge--${size}`])}>{children}</div>;
}
