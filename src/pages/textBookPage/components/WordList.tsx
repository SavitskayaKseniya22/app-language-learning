import React from "react";
import styled from "styled-components";
import { WordType } from "../../../interfaces";
import Word from "./Word";

const StyledWordList = styled("ul")`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    align-items: center;
`;

function WordList({
    data,
    encountered,
    learned,
}: {
    data: WordType[];
    encountered?: WordType[];
    learned?: WordType[];
}) {
    return (
        <StyledWordList>
            {data.map((word, index) => {
                const isItLearned = learned ? !!learned.filter(item => word.id === item.id)[0] : false;

                const isItEncountered = encountered ? !!encountered.filter(item => word.id === item.id)[0] : false;

                return (
                    <Word
                        wordData={word}
                        key={word.id}
                        modifier={{
                            isItOdd: !!(index % 2),
                            isItLearned,
                            isItEncountered,
                        }}
                    />
                );
            })}
        </StyledWordList>
    );
}

export default WordList;
