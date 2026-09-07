import { useContext } from "react";
import styled from "styled-components";
import type { WordType } from "../../../shared/types/interfaces";
import { ScreenSize } from "../../../shared/types/interfaces";
import WordDetailed from "./word-detailed";
import ModalContext from "../../../shared/ui/modal/modal-context";

export interface WordModifierType {
    isItEncountered?: boolean;
    isItLearned?: boolean;
    isItCorrect?: boolean;
    isItOdd?: boolean;
}

const StyledWord = styled("li")<{ $modifier: WordModifierType | undefined }>`
    cursor: pointer;
    padding: 1rem;
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    flex-grow: 3;
    max-height: 120px;
    position: relative;

    opacity: ${properties => (properties.$modifier && properties.$modifier.isItLearned ? "0.5" : "1")};

    background-color: ${properties =>
        properties.$modifier && properties.$modifier.isItOdd ? "rgba(233, 197, 106, 0.2)" : "rgba(42, 157, 144, 0.2)"};

    @media ${ScreenSize.TABLET} {
        padding: 1.5rem;
    }

    .word__transcription {
        color: ${properties => (properties.$modifier && properties.$modifier.isItOdd ? "rgb(42, 157, 143)" : "rgb(233, 196, 106)")};
    }

    .word__mark {
        border-radius: 100%;
        background-color: white;
        color: rgba(38, 70, 83);
        padding: 0.3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
    }
`;

function Word({ wordData, modifier }: { wordData: WordType; modifier?: WordModifierType }) {
    const { setContent } = useContext(ModalContext);

    return (
        <StyledWord
            $modifier={modifier}
            onClick={() => {
                setContent({ body: <WordDetailed wordData={wordData} /> });
            }}>
            <h4>{wordData.word}</h4>
            <span className="word__transcription">{wordData.transcription}</span>
            <h5>{wordData.wordTranslate}</h5>

            {modifier && (modifier.isItEncountered || modifier.isItLearned) && (
                <div
                    className="word__mark"
                    title={
                        (modifier.isItEncountered && "The word is encountered for the first time") ||
                        (modifier.isItLearned && "The word is learned") ||
                        wordData.word
                    }>
                    {modifier.isItEncountered && <i className="fa-solid fa-exclamation" />}
                    {modifier.isItLearned && <i className="fa-solid fa-check" />}
                </div>
            )}
        </StyledWord>
    );
}

export default Word;
