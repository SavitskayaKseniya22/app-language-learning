import type { ReactNode } from "react";
import styles from "./icon.module.scss";
import clsx from "clsx";
import type { SizeType } from "@/shared/types/interfaces";

export default function StyledIcon({ children, size = "medium" }: { children: ReactNode; size?: SizeType }) {
    return <div className={clsx(styles.icon, styles[`icon--${size}`])}>{children}</div>;
}
