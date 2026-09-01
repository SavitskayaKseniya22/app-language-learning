import type { ReactNode } from "react";
import styles from "./table.module.scss";
import clsx from "clsx";

export type TitleType = {
    key: string;
    widthInGrid: string;
    title?: ReactNode;
    justify?: "start" | "center" | "end";
    align?: "start" | "center" | "end";
};

interface CustomTableDataType {
    rows: {
        content: Record<string, ReactNode | ReactNode[]>;
        options?: { className?: string };
    }[];
    titles?: TitleType[];
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
    withTitles = true,
}: {
    tableId: string;
    data: CustomTableDataType;
    withTitles?: boolean;
}) {
    const gridTemplateColumns = data.titles?.map(item => item.widthInGrid).join(" ");

    return (
        <div className={styles.table}>
            {data.titles && withTitles && (
                <div className={styles.table__titles} style={{ gridTemplateColumns }}>
                    {data.titles.map((item, index) => {
                        const { justify = "start", align = "center" } = item;
                        return (
                            <div
                                key={`${tableId}-title-${index}`}
                                className={clsx(
                                    styles.table__title,
                                    styles[`table__title--justify-${justify}`],
                                    styles[`table__cell--align-${align}`],
                                )}>
                                {item.title}
                            </div>
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
                            const { key, justify = "start", align = "center" } = item;
                            const className = clsx(
                                styles.table__cell,
                                styles[`table__cell--justify-${justify}`],
                                styles[`table__cell--align-${align}`],
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
