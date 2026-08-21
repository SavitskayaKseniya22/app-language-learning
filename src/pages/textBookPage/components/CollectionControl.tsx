import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { CollectionType, WordType, WordWithIdDataType } from "../../../interfaces";
import { useUpdateUserWordMutation } from "../../../store/userWordsApi";
import { useAppSelector } from "../../../store/store";

const StyledCollectionControl = styled("label")<{ $isItchecked: boolean }>`
    display: flex;
    text-align: center;
    cursor: pointer;
    opacity: ${props => (props.$isItchecked ? 1 : 0.3)};
    color: rgba(38, 70, 83);

    input {
        display: none;
    }
`;

function CollectionControl({
    wordData,
    collectionType,
    wordDataDetailed,
}: {
    wordData: WordType;
    collectionType: CollectionType;
    wordDataDetailed: WordWithIdDataType | null;
}) {
    const { user } = useAppSelector(state => state.persist.auth);
    const [updateUserWord] = useUpdateUserWordMutation();

    const isItInCollection = (wordDataDetailed && wordDataDetailed[collectionType]) || false;

    const isItDifficult = (wordDataDetailed && wordDataDetailed[CollectionType.DIFFICULT]) || false;

    const isItLearned = (wordDataDetailed && wordDataDetailed[CollectionType.LEARNED]) || false;

    const { register, watch } = useForm<{
        [type: string]: boolean;
    }>({
        defaultValues: {
            [collectionType]: isItInCollection,
        },
    });

    const isItChecked = watch(collectionType);

    return (
        <StyledCollectionControl htmlFor={collectionType} $isItchecked={isItChecked}>
            {collectionType}
            <input
                {...register(collectionType, {
                    onChange: e => {
                        const data = wordDataDetailed ? { ...wordDataDetailed } : { ...wordData };

                        if (e.target.checked) {
                            if (collectionType === CollectionType.SELECTED) {
                                Object.assign(data, { selected: true });
                            }
                            if (collectionType === CollectionType.LEARNED) {
                                Object.assign(data, {
                                    learned: true,
                                    guessed: isItDifficult ? 5 : 3,
                                });
                            }
                            if (collectionType === CollectionType.DIFFICULT) {
                                const addition = isItLearned ? { guessed: 5 } : {};
                                Object.assign(data, {
                                    difficult: true,
                                    ...addition,
                                });
                            }
                        } else {
                            if (collectionType === CollectionType.SELECTED) {
                                Object.assign(data, { selected: false });
                            }
                            if (collectionType === CollectionType.LEARNED) {
                                Object.assign(data, { learned: false, guessed: 0 });
                            }
                            if (collectionType === CollectionType.DIFFICULT) {
                                Object.assign(data, {
                                    difficult: false,
                                    guessed: isItLearned ? 3 : 0,
                                });
                            }
                        }
                        updateUserWord({
                            userId: user!.localId,
                            wordId: wordData.id,
                            data,
                            tokenId: user!.idToken,
                        });
                    },
                })}
                type="checkbox"
                id={collectionType}
            />
        </StyledCollectionControl>
    );
}

export default CollectionControl;
