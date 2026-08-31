import { useContext } from "react";
import styled from "styled-components";
import GamesPanel from "../../../widgets/games-list/ui/games-list";
import WordList from "../../text-book-page/components/word-list";
import ModalContext from "../../../components/modal/modal-context";
import type { CollectionLikeArraysType, WordWithIdType } from "../../../shared/types/interfaces";
import { CollectionType, ScreenSize } from "../../../shared/types/interfaces";
import { useAppSelector } from "../../../app/store/store";
import { useAddToUserWordsMutation } from "../../../store/user-words-api";

const StyledCollectionPart = styled("li")`
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
                    disabled={data[type].length === 0}
                    onClick={() => {
                        const updatedWords: WordWithIdType = {};

                        for (const word of data[type]) {
                            const temporary = { ...word };

                            if (type === CollectionType.SELECTED) {
                                Object.assign(temporary, { selected: false });
                            }

                            if (type === CollectionType.LEARNED) {
                                Object.assign(temporary, { learned: false, guessed: 0 });
                            }

                            if (type === CollectionType.DIFFICULT) {
                                Object.assign(temporary, {
                                    difficult: false,
                                    guessed: word.learned ? 3 : 0,
                                });
                            }
                            Object.assign(updatedWords, { [word.id]: temporary });
                        }

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
                {data[type].length > 0 ? <WordList data={data[type]} /> : <h5>Not a word added</h5>}
            </div>
        </StyledCollectionPart>
    );
}

export default CollectionPart;
