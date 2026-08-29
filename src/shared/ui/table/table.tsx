import type { ReactNode } from "react";
import ImageArrow from "./icon-arrow-down-triangle-16.svg?react";
import styles from "./table.module.scss";

import clsx from "clsx";
import SVGWrapper from "../svg-wrapper/svg-wrapper";

export interface SortConfig {
    key: string;
    direction: "asc" | "desc";
}

export type TitleType = {
    key: string;
    widthInGrid: string;
    title?: ReactNode;
    sortBy?: boolean;
    isDefault?: boolean;
    justify?: "start" | "center" | "end";
    align?: "start" | "center" | "end";
    withoutOverflow?: boolean;
    isExpendable?: boolean;
};

interface CustomTableDataType {
    rows: {
        content: Record<string, ReactNode | ReactNode[]>;
        options?: { className?: string };
    }[];
    titles?: TitleType[];
}

export interface CustomTableSortType {
    activeItem: SortConfig | undefined;
    returnNewActiveItem: (value: SortConfig) => void;
}

function flattenRows(data: CustomTableDataType): CustomTableDataType {
    const newRows: CustomTableDataType["rows"] = [];

    for (const row of data.rows) {
        const arrayKeys = Object.keys(row.content).filter(
            key => Array.isArray(row.content[key]) && row.content[key].length > 0,
        );

        if (arrayKeys.length === 0) {
            newRows.push(row);
            continue;
        }

        const maxLength = Math.max(...arrayKeys.map(key => (row.content[key] as ReactNode[]).length));

        for (let index = 0; index < maxLength; index++) {
            const newContent: Record<string, ReactNode | ReactNode[] | null> = {};

            for (const key of Object.keys(row.content)) {
                const value = row.content[key];

                if (Array.isArray(value)) {
                    newContent[key] = value[index] ?? null;
                } else {
                    newContent[key] = index === 0 ? value : null;
                }
            }

            newRows.push({
                ...row,
                content: Object.fromEntries(Object.entries(newContent).map(([k, v]) => [k, v ? [v] : null])),
            });
        }
    }

    return { ...data, rows: newRows };
}

export default function CustomTable({
    tableId,
    data,
    sort,
    withTitles = true,
}: {
    tableId: string;
    data: CustomTableDataType;
    sort?: CustomTableSortType;
    withTitles?: boolean;
}) {
    const handleSort = (value: string) => {
        if (sort) {
            const config: SortConfig =
                value === sort?.activeItem?.key
                    ? { ...sort.activeItem, direction: sort.activeItem.direction === "desc" ? "asc" : "desc" }
                    : { key: value, direction: "desc" };
            sort.returnNewActiveItem(config);
        }
    };

    const gridTemplateColumns = data.titles?.map(item => item.widthInGrid).join(" ");

    return (
        <div className={styles.table}>
            {data.titles && withTitles && (
                <div className={styles.table__titles} style={{ gridTemplateColumns }}>
                    {data.titles.map((item, index) => {
                        const { sortBy, key, justify = "start", align = "center" } = item;
                        return (
                            <button
                                key={`${tableId}-title-${index}`}
                                className={clsx(
                                    styles.table__title,
                                    { ["styles.table__title--sortable"]: sortBy },
                                    {
                                        [styles[`table__title_${sort?.activeItem?.direction}`]]:
                                            key === sort?.activeItem?.key,
                                    },
                                    styles[`table__title_justify-${justify}`],
                                    styles[`table__cell_align-${align}`],
                                )}
                                onClick={() => {
                                    if (item.sortBy) {
                                        handleSort(item.key);
                                    }
                                    return;
                                }}>
                                {item.title}
                                {item.sortBy && (
                                    <SVGWrapper view={"fill"} className={styles.table__icon}>
                                        <ImageArrow />
                                    </SVGWrapper>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {flattenRows(data).rows.map((row, index) => {
                return (
                    <div
                        className={clsx(styles.table__row, row.options?.className)}
                        style={{ gridTemplateColumns }}
                        key={`${tableId}-row-${index}`}>
                        {data.titles?.map((item, index_) => {
                            const { key, justify = "start", align = "center", withoutOverflow = false } = item;
                            const className = clsx(
                                styles.table__cell,
                                styles[`table__cell_justify-${justify}`],
                                styles[`table__cell_align-${align}`],
                                withoutOverflow && styles[`table__cell_overflow`],
                            );
                            const nodeId = `${tableId}-cell-${index}-${index_}`;
                            const content = row.content[key];

                            return (
                                <div key={nodeId} className={className}>
                                    {content}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}
