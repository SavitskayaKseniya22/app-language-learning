import styled from "styled-components";
import type { PointsType, SubtrahendType } from "../../../interfaces";
import { ScreenSize } from "../../../interfaces";

const StyledPointsList = styled("div")`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;

    @media ${ScreenSize.LAPTOPS} {
        align-items: flex-end;
        gap: 1rem;
        margin-left: auto;
    }

    & > * {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .points__addition {
        @media ${ScreenSize.TABLET} {
            display: flex;
        }
    }
`;

const StyledPointsItem = styled("span")`
    font-size: 1.5rem;

    @media ${ScreenSize.TABLET} {
        font-size: 2rem;
    }

    &.points__total {
        font-size: 3rem;

        @media ${ScreenSize.TABLET} {
            font-size: 3rem;
        }
    }
`;

function Points({ step, total, subtrahend }: PointsType & SubtrahendType) {
    return (
        <StyledPointsList>
            <h3>
                <span className="points__title">Total score: </span>

                <StyledPointsItem className="points__total">{total}</StyledPointsItem>
            </h3>

            <h5 className="points__addition">
                Correct answer score: <StyledPointsItem>{`${step}`}</StyledPointsItem>
            </h5>
            {subtrahend > 0 && (
                <h5 className="points__addition">
                    Wrong answer cost: <StyledPointsItem>{`${subtrahend}`}</StyledPointsItem>
                </h5>
            )}
        </StyledPointsList>
    );
}

export default Points;
