import styles from "./svg.module.scss";
import clsx from "clsx";

export default function SVGWrapper({
    view,
    children,
    className,
}: {
    view: "stroke" | "fill";
} & React.ComponentProps<"span">) {
    return <span className={clsx(styles.svg, styles[`svg_${view}`], className)}>{children}</span>;
}
