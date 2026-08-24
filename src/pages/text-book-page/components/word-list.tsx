import styled from "styled-components";
import type { WordType } from "../../../interfaces";
import Word from "./word";

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
                const isItLearned = learned ? !!learned.find(item => word.id === item.id) : false;

                const isItEncountered = encountered ? !!encountered.find(item => word.id === item.id) : false;

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
