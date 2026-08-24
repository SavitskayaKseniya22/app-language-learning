import styled from "styled-components";
import { useAppSelector } from "../../app/store/store";
import type { WordWithIdType } from "../../shared/types/interfaces";
import { CollectionType } from "../../shared/types/interfaces";
import Spinner from "../../components/spinner/spinner";
import CollectionPart from "./components/collection-part";
import { useAddToUserWordsMutation, useGetUserWordsCollectionsQuery } from "../../store/user-words-api";

const StyledCollectionList = styled("ul")`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex-grow: 2;
    width: 100%;
`;

const StyledRemoveAllButton = styled("button")`
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 2rem;
    color: rgb(231, 111, 81);
`;

function Collection() {
    const { user } = useAppSelector(state => state.persist.auth);

    const { data, isLoading, isSuccess } = useGetUserWordsCollectionsQuery({
        userId: user!.localId,
        tokenId: user!.idToken,
    });

    const [addToUserWords] = useAddToUserWordsMutation();

    if (isLoading) return <Spinner />;

    if (isSuccess) {
        return (
            <main className="main">
                <h2 className="main__title_main">Collection</h2>
                <StyledCollectionList>
                    <CollectionPart data={data} type={CollectionType.DIFFICULT} />
                    <CollectionPart data={data} type={CollectionType.SELECTED} />
                    <CollectionPart data={data} type={CollectionType.LEARNED} />
                </StyledCollectionList>
                <StyledRemoveAllButton
                    type="button"
                    onClick={() => {
                        if (data) {
                            const updatedWords: WordWithIdType = {};

                            for (const word of data.all) {
                                Object.assign(updatedWords, {
                                    [word.id]: {
                                        ...word,
                                        selected: false,
                                        learned: false,
                                        difficult: false,
                                        guessed: 0,
                                    },
                                });
                            }

                            addToUserWords({
                                userId: user!.localId,
                                data: updatedWords,
                                tokenId: user!.idToken,
                            });
                        }
                    }}>
                    <i className="fa-regular fa-trash-can" />
                </StyledRemoveAllButton>
            </main>
        );
    }
    return <>no Data</>;
}

export default Collection;
