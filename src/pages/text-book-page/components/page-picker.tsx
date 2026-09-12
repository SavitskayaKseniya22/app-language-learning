import type { Dispatch, SetStateAction } from "react";
import { useRef } from "react";
import styled from "styled-components";

enum ScreenSize {
    MOBILE = "(min-width: 320px)",
    TABLET = "(min-width: 768px)",
    LAPTOPS = "(min-width: 1024px)",
    DESKTOP = "(min-width: 1920px)",
}

enum WordBaseValues {
    MINGROUP = 0,
    MAXGROUP = 5,
    MINPAGE = 0,
    MAXPAGE = 29,
    MAXWORD = 19,
    MINWORD = 0,
}

const StyledPagePicker = styled("div")`
    display: flex;
    gap: 1rem;

    input {
        display: none;
    }
`;

const StyledPagePickerButton = styled("button")`
    width: 2rem;
    height: 2rem;
    color: white;
    background-color: rgb(244, 162, 97);

    @media ${ScreenSize.TABLET} {
        width: 2.5rem;
        height: 2.5rem;
        font-size: 1rem;
    }

    &.page-picker__page-info {
        pointer-events: none;
    }
`;

function PagePicker({ values }: { values: { page: number } & { setPage: Dispatch<SetStateAction<number>> } }) {
    const borderValues = useRef({ prev: 0, next: 1 });

    const handleClick = (value: number) => {
        values.setPage(value);

        const previous = value > WordBaseValues.MINPAGE ? value - 1 : WordBaseValues.MINPAGE;

        const next = value < WordBaseValues.MAXPAGE ? value + 1 : WordBaseValues.MAXPAGE;

        borderValues.current = { prev: previous, next };
    };

    return (
        <StyledPagePicker>
            <StyledPagePickerButton
                disabled={values.page === WordBaseValues.MINPAGE}
                onClick={() => {
                    handleClick(WordBaseValues.MINPAGE);
                }}>
                <i className="fa-solid fa-backward-fast" />
            </StyledPagePickerButton>

            <StyledPagePickerButton
                disabled={values.page === borderValues.current.prev}
                onClick={() => {
                    handleClick(borderValues.current.prev);
                }}>
                <i className="fa-solid fa-backward" />
            </StyledPagePickerButton>

            <StyledPagePickerButton className="page-picker__page-info">{values.page}</StyledPagePickerButton>

            <StyledPagePickerButton
                disabled={values.page === borderValues.current.next}
                onClick={() => {
                    handleClick(borderValues.current.next);
                }}>
                <i className="fa-solid fa-forward" />
            </StyledPagePickerButton>

            <StyledPagePickerButton
                disabled={values.page === WordBaseValues.MAXPAGE}
                onClick={() => {
                    handleClick(WordBaseValues.MAXPAGE);
                }}>
                <i className="fa-solid fa-forward-fast" />
            </StyledPagePickerButton>
        </StyledPagePicker>
    );
}

export default PagePicker;
