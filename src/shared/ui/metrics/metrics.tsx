import styles from "./metrics.module.scss";
import clsx from "clsx";

export type Metric = {
    label: string;
    value: number | string;
    description?: string;
};

const numberFormat = new Intl.NumberFormat("ru-RU");

function MetricCard({ label, value, description }: Metric) {
    return (
        <div className={styles.metrics__card}>
            <dt className={styles.metrics__label}>{label}</dt>
            <dd className={styles.metrics__content}>
                <span className={styles.metrics__value}>
                    {typeof value === "number" ? numberFormat.format(value) : value}
                </span>
                {description && <span className={styles.metrics__description}>{description}</span>}
            </dd>
        </div>
    );
}

export default function Metrics({
    items,
    view = "primary",
}: {
    items: readonly Metric[];
    view?: "primary" | "secondary";
}) {
    return (
        <dl className={clsx(styles.metrics, { [styles["metrics--secondary"]]: view === "secondary" })}>
            {items.map(item => (
                <MetricCard key={item.label} {...item} />
            ))}
        </dl>
    );
}
