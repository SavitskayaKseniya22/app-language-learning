import React from "react";
import { useForm } from "react-hook-form";

import styled from "styled-components";
import { makeEmptyArrayWithIds } from "../../../utils";
import { GameDifficultyType } from "../../../interfaces";

const StyledGroupPicker = styled("form")`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    align-items: center;

    input {
        display: none;

        &:checked + label {
            background-color: transparent;
            color: rgb(42, 157, 143);
        }
    }

    label {
        cursor: pointer;
        width: 2rem;
        height: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        background-color: rgb(42, 157, 143);
        font-size: 1.25rem;
    }

    ul {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
    }
`;

function GroupPicker({
    value,
    onSubmit,
}: {
    value: GameDifficultyType;
    onSubmit: ({ group }: { group: string }) => void;
}) {
    const { register, handleSubmit } = useForm({
        defaultValues: { group: "0" },
    });

    return (
        <StyledGroupPicker onSubmit={handleSubmit(onSubmit)}>
            <h3>Select difficulty:</h3>
            <ul>
                {makeEmptyArrayWithIds(value).map((item, i) => (
                    <li key={item.key}>
                        <input {...register("group")} type="radio" value={i} id={`group-${item.key}`} />
                        <label htmlFor={`group-${item.key}`}>{i}</label>
                    </li>
                ))}
            </ul>

            <button type="submit">Start the game</button>
        </StyledGroupPicker>
    );
}

export default GroupPicker;
