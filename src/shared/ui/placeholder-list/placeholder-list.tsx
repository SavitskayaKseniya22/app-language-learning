import styles from "./placeholder-list.module.scss";
export function PlaceholderList({
    length = 8,
    height = "40px",
    gap = "16px",
}: {
    length?: number;
    height?: string;
    gap?: string;
}) {
    const dummyData: number[] = Array.from({ length }, (_, index) => index + 1);
    return (
        <ul
            className={styles.placeholder}
            style={{ ["--placeholder-height" as string]: height, ["--placeholder-gap" as string]: gap }}>
            {dummyData.map(item => (
                <li className={styles.placeholder__item} key={item} />
            ))}
        </ul>
    );
}
