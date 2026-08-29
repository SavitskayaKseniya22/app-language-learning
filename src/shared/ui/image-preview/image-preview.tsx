import type { ComponentProps } from "react";
import clsx from "clsx";
import styles from "./image.module.scss";

export default function ImagePreview(properties: ComponentProps<"img"> & { size: "big" | "medium" | "small" }) {
    return (
        <div className={clsx(styles.image, styles[`image--${properties.size}`])}>
            <img src={properties.src} alt={properties.alt} />
        </div>
    );
}
