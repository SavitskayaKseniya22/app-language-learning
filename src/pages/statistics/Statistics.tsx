import React, { useState } from "react";
import styled from "styled-components";
import { StyledMain } from "../../styled/SharedStyles";
import StatTable from "./components/StatTable";
import StatTableControl from "./components/StatTableControl";
import { useGetUserResultsQuery } from "../../store/userWordsApi";
import { useAppSelector } from "../../store/store";
import { StatControlType } from "../../interfaces";

const StyledStatistics = styled("div")`
    flex-grow: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5rem;
`;

function Statistics() {
    const { user } = useAppSelector(state => state.persist.auth);

    const { data, isSuccess } = useGetUserResultsQuery(
        {
            userId: user?.localId || "localId",
            tokenId: user?.idToken || "idToken",
        },
        {
            skip: !user,
        },
    );

    const [type, setType] = useState<StatControlType>(StatControlType.TODAY);

    return (
        <StyledMain>
            <h2 className="main__title_main">Statistics</h2>

            {data && isSuccess && (
                <StyledStatistics>
                    <StatTableControl onChange={setType} />
                    <StatTable preData={data[type]} />
                </StyledStatistics>
            )}
        </StyledMain>
    );
}

export default Statistics;
