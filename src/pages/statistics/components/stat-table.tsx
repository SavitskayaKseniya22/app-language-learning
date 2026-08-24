import { useEffect, useState } from "react";
import styled from "styled-components";
import type { RefinedResultsType, StatiscticsType } from "../../../shared/types/interfaces";
import { ScreenSize } from "../../../shared/types/interfaces";
import { refineData } from "../../../shared/lib/utilities";

const StyledStatisticTable = styled("table")`
    border-spacing: 0.1rem;
    font-size: smaller;
    empty-cells: hide;
    text-align: center;

    @media ${ScreenSize.TABLET} {
        border-spacing: 0.5rem;
        font-size: unset;
    }

    @media ${ScreenSize.LAPTOPS} {
        border-spacing: 0.75rem;
    }

    td,
    th {
        padding: 0.5rem;
        color: white;

        @media ${ScreenSize.TABLET} {
            padding: 1rem;
        }

        @media ${ScreenSize.LAPTOPS} {
            padding: 1.5rem;
        }
    }

    th {
        &[scope="col"] {
            background-color: rgb(42, 157, 143);

            span {
                display: none;
            }

            @media ${ScreenSize.LAPTOPL} {
                i {
                    margin-left: 1rem;
                }

                span {
                    display: inline-block;
                }
            }
        }

        &[scope="row"] {
            background-color: rgb(231, 111, 81);
            font-size: 10px;

            @media ${ScreenSize.TABLET} {
                padding: 1rem;
                font-size: unset;
            }

            &.total {
                background-color: rgba(38, 70, 83);
            }
        }
    }

    td {
        color: rgba(38, 70, 83);

        &:nth-child(odd) {
            background-color: rgba(42, 157, 144, 0.2);
        }

        &:nth-child(even) {
            background-color: rgba(233, 197, 106, 0.2);
        }
    }

    tbody {
        tr:last-child {
            td {
                &:nth-child(odd) {
                    background-color: rgba(42, 157, 144, 0.5);
                }

                &:nth-child(even) {
                    background-color: rgba(233, 197, 106, 0.5);
                }

                &:last-child {
                    background-color: rgba(42, 157, 144, 1);
                    color: white;
                }
            }
        }
    }
`;

function StatTable({ preData }: { preData: StatiscticsType | undefined }) {
    const [data, setData] = useState<undefined | RefinedResultsType>();

    useEffect(() => {
        if (preData) {
            setData(refineData(preData));
        }
    }, [preData]);

    return (
        <StyledStatisticTable>
            <thead>
                <tr>
                    <th />
                    <th scope="col" title="Best time">
                        <span>Best time</span>
                        <i className="fa-regular fa-clock" />
                    </th>
                    <th scope="col" title="New words learned">
                        <span>New words learned</span>
                        <i className="fa-solid fa-book-bookmark" />
                    </th>
                    <th scope="col" title="New words encountered">
                        <span>New words encountered</span>
                        <i className="fa-solid fa-handshake-simple" />
                    </th>
                    <th scope="col" title="Accuracy">
                        <span>Accuracy</span>
                        <i className="fa-solid fa-percent" />
                    </th>
                    <th scope="col" title="Games played">
                        <span>Games played</span>
                        <i className="fa-solid fa-puzzle-piece" />
                    </th>
                    <th scope="col" title="Score">
                        <span>Score</span> <i className="fa-solid fa-database" />
                    </th>
                </tr>
            </thead>

            <tbody>
                {data &&
                    Object.entries(data).map(([key, value]) => (
                        <tr key={key}>
                            <th scope="row" className={key === "total" ? "total" : ""}>
                                {key}
                            </th>
                            <td>{value.time}</td>
                            <td>{value.learned}</td>
                            <td>{value.encountered}</td>
                            <td>{value.accuracy}</td>
                            <td>{value.played}</td>
                            <td>{value.score}</td>
                        </tr>
                    ))}
            </tbody>
        </StyledStatisticTable>
    );
}

export default StatTable;
