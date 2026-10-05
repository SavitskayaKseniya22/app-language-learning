import { Fragment, useId, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./segmented-control.module.scss";

type SegmentedControlProperties<T extends string> = {
    options: readonly { value: T; label: ReactNode }[];
    value: T;
    onChange: (value: T) => void;
    label: string;
    className?: string;
};

export default function SegmentedControl<T extends string>({
    options,
    value,
    onChange,
    label,
    className,
}: SegmentedControlProperties<T>) {
    const id = useId();
    const selectedIndex = options.findIndex(option => option.value === value);
    if (options.length === 0) return null;
    return (
        <div
            className={clsx(styles.control, className)}
            role="radiogroup"
            aria-label={label}
            style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
            {options.map((option, index) => (
                <Fragment key={option.value}>
                    <input
                        className={styles.control__input}
                        id={`${id}-${index}`}
                        name={id}
                        type="radio"
                        value={option.value}
                        checked={option.value === value}
                        onChange={() => onChange(option.value)}
                    />
                    <label className={styles.control__label} htmlFor={`${id}-${index}`}>
                        {option.label}
                    </label>
                </Fragment>
            ))}
            {selectedIndex !== -1 && (
                <span
                    className={styles.control__indicator}
                    style={{
                        width: `calc((100% - 8px) / ${options.length})`,
                        transform: `translateX(${selectedIndex * 100}%)`,
                    }}
                />
            )}
        </div>
    );
}
