import { useState } from "react";
import styled from "styled-components";
import StatTable from "./components/stat-table";
import StatTableControl from "./components/stat-table-control";

import { StatControlType } from "../../shared/types/interfaces";
import { useGetUserResultsQuery } from "@/app/api/user-api";

const StyledStatistics = styled("div")`
    flex-grow: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5rem;
`;

function Statistics() {
    const { data, isSuccess } = useGetUserResultsQuery();

    const [type, setType] = useState<StatControlType>(StatControlType.TODAY);

    return (
        <main className="main">
            <h2 className="main__title_main">Statistics</h2>

            {data && isSuccess && (
                <StyledStatistics>
                    <StatTableControl onChange={setType} />
                    <StatTable preData={data[type]} />
                </StyledStatistics>
            )}
        </main>
    );
}

export default Statistics;
