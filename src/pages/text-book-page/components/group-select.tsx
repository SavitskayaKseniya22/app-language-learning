import type React from "react";
import styled from "styled-components";
import type { GroupType } from "../../../interfaces";

const StyledGroupSelect = styled("select")`
    background-color: transparent;
    border: none;
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
    line-height: inherit;
`;

function GroupSelect({
    values,
}: {
    values: GroupType & {
        setGroup: React.Dispatch<React.SetStateAction<string>>;
    };
}) {
    return (
        <StyledGroupSelect
            onChange={event => {
                values.setGroup(event.target.value);
            }}>
            <option value="0">Choose word difficulty - Basic</option>
            <option value="1">Light</option>
            <option value="2">Medium</option>
            <option value="3">Complicated</option>
            <option value="4">Difficult</option>
            <option value="5">Terrific</option>
        </StyledGroupSelect>
    );
}

export default GroupSelect;
