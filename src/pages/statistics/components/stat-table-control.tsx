import type React from "react";
import styled from "styled-components";
import { StatControlType } from "../../../interfaces";

const StyledStatisticTableControl = styled("div")`
    display: flex;
    position: relative;
    width: 16rem;

    .control_moving {
        width: 8rem;
        height: 2rem;
        background-color: rgba(38, 70, 83, 0.2);
        position: absolute;
        top: 0;
        left: 0;
        transition: 0.5s;
    }

    .control_static {
        width: 8rem;
        height: 2rem;
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    input[type="radio"] {
        display: none;

        &[id="today"]:checked ~ .control_moving {
            transform: translateX(0);
        }

        &[id="total"]:checked ~ .control_moving {
            transform: translateX(8rem);
        }
    }
`;

function StatTableControl({ onChange }: { onChange: React.Dispatch<React.SetStateAction<StatControlType>> }) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (value === StatControlType.TODAY || value === StatControlType.TOTAL) {
            onChange(value);
        }
    };

    return (
        <StyledStatisticTableControl>
            <input
                id={StatControlType.TODAY}
                type="radio"
                name="statType"
                defaultChecked
                value={StatControlType.TODAY}
                onClick={() => {}}
                onChange={handleChange}
            />

            <label htmlFor={StatControlType.TODAY} className="control_static">
                Today
            </label>

            <input
                id={StatControlType.TOTAL}
                type="radio"
                name="statType"
                value={StatControlType.TOTAL}
                onChange={handleChange}
            />

            <label htmlFor={StatControlType.TOTAL} className="control_static">
                All time
            </label>
            <div className="control_moving" />
        </StyledStatisticTableControl>
    );
}

export default StatTableControl;
