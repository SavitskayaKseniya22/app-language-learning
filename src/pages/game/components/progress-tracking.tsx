import styled from "styled-components";
import { makeEmptyArrayWithIds } from "../../../shared/lib/utilities";
import type { ProgressType } from "../../../shared/types/interfaces";

const StyledProgressTracking = styled("div")`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    flex-direction: column;
    gap: 0.5rem;
`;

const StyledProgressList = styled("ul")`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 1rem;
    flex-wrap: nowrap;
    width: 20rem;
`;

const StyledProgressItem = styled("li")<{ $type: "fullfilled" | "empty" }>`
    background-color: ${properties => (properties.$type === "fullfilled" ? "rgb(244, 162, 97)" : "rgba(233, 197, 106, 0.5)")};

    flex-grow: 1;
    height: 1rem;
`;

const StyledProgressInfo = styled("h5")`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
`;

function ProgressTracking({ streak, total }: ProgressType) {
    return (
        <StyledProgressTracking>
            <StyledProgressList>
                {makeEmptyArrayWithIds(total).map((item, index) => (
                    <StyledProgressItem key={item.key} $type={index < streak ? "fullfilled" : "empty"} />
                ))}
            </StyledProgressList>
            <StyledProgressInfo>
                {streak} of {total}
            </StyledProgressInfo>
        </StyledProgressTracking>
    );
}

export default ProgressTracking;
