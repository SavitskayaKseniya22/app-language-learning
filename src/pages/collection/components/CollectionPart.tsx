import React, { useContext } from "react";
import styled from "styled-components";
import GamesPanel from "../../textBookPage/components/GamesPanel";
import WordList from "../../textBookPage/components/WordList";
import ModalContext from "../../../components/modal/ModalContext";
import { CollectionLikeArraysType, CollectionType, ScreenSize, WordWithIdType } from "../../../interfaces";
import { useAppSelector } from "../../../store/store";
import { useAddToUserWordsMutation } from "../../../store/userWordsApi";

export const StyledCollectionPart = styled("li")`
    display: flex;
    flex-direction: column;
    flex-grow: 2;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem;
    position: relative;

    @media ${ScreenSize.LAPTOPS} {
        padding: 2rem;
    }

    .collection-part__title {
        @media ${ScreenSize.TABLET} {
            align-self: flex-start;
        }
    }

    .collection-part__controls {
        display: flex;
        gap: 1rem;
        font-size: 1.5rem;
        color: gray;

        @media ${ScreenSize.TABLET} {
            position: absolute;
            top: 1rem;
            right: 1rem;
        }
    }

    .collection-part__container {
        flex-grow: 2;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
    }
`;

function CollectionPart({ data, type }: { data: CollectionLikeArraysType; type: CollectionType }) {
    const { user } = useAppSelector(state => state.persist.auth);
    const { setContent } = useContext(ModalContext);
    const [addToUserWords] = useAddToUserWordsMutation();

    return (
        <StyledCollectionPart>
            <h3 className="collection-part__title">{`${type}`} words</h3>
            <div className="collection-part__controls">
                <button
                    type="button"
                    disabled={!data[type].length}
                    onClick={() => {
                        const updatedWords: WordWithIdType = {} as WordWithIdType;

                        data[type].forEach(word => {
                            const temp = { ...word };

                            if (type === CollectionType.SELECTED) {
                                Object.assign(temp, { selected: false });
                            }

                            if (type === CollectionType.LEARNED) {
                                Object.assign(temp, { learned: false, guessed: 0 });
                            }

                            if (type === CollectionType.DIFFICULT) {
                                Object.assign(temp, {
                                    difficult: false,
                                    guessed: word.learned ? 3 : 0,
                                });
                            }
                            Object.assign(updatedWords, { [word.id]: temp });
                        });

                        addToUserWords({
                            userId: user!.localId,
                            data: updatedWords,
                            tokenId: user!.idToken,
                        });
                    }}>
                    <i className="fa-regular fa-trash-can" />
                </button>

                <button
                    type="button"
                    disabled={data[type].length < 10}
                    onClick={() => {
                        setContent(<GamesPanel data={data[type]} group="0" />);
                    }}>
                    <i className="fa-solid fa-puzzle-piece" />
                </button>
            </div>

            <div className="collection-part__container">
                {data[type].length ? <WordList data={data[type]} /> : <h5>Not a word added</h5>}
            </div>
        </StyledCollectionPart>
    );
}

export default CollectionPart;
