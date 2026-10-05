import type React from "react";
import styles from "./stat-table-control.module.scss";

const StatControlType = { TODAY: "today", TOTAL: "total" } as const;
type StatControlType = (typeof StatControlType)[keyof typeof StatControlType];

function StatTableControl({ onChange }: { onChange: React.Dispatch<React.SetStateAction<StatControlType>> }) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (value === StatControlType.TODAY || value === StatControlType.TOTAL) {
            onChange(value);
        }
    };

    return (
        <div className={styles.control}>
            <input
                id={StatControlType.TODAY}
                type="radio"
                className={styles.control__input}
                name="statType"
                defaultChecked
                value={StatControlType.TODAY}
                onChange={handleChange}
            />

            <label htmlFor={StatControlType.TODAY} className={styles.control__label}>
                Сегодня
            </label>

            <input
                id={StatControlType.TOTAL}
                type="radio"
                className={styles.control__input}
                name="statType"
                value={StatControlType.TOTAL}
                onChange={handleChange}
            />

            <label htmlFor={StatControlType.TOTAL} className={styles.control__label}>
                За всё время
            </label>
            <div className={styles.control__indicator} />
        </div>
    );
}

export default StatTableControl;
