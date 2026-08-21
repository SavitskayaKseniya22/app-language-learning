/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ResultType, ResultsState, WordType, WordWithIdType } from "../../../interfaces";
import {
    useAddToUserWordsMutation,
    useGetUserWordsQuery,
    useUpdateUserResultsMutation,
} from "../../../store/userWordsApi";
import { useAppSelector } from "../../../store/store";
import WordList from "../../textBookPage/components/WordList";
import { getPercent } from "../../../utils";

export const StyledGameResultContent = styled("ul")`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: safe center;
    justify-content: safe center;

    overflow: auto;
    max-height: 55svh;
    position: relative;
    flex-grow: 2;
    mask-image: linear-gradient(rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0.2));
    mask-size: 100% 100%;
    mask-repeat: no-repeat;
`;

export const StyledGameResultContentItem = styled("li")`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

function GameResultDetailed({
    type,
    results,
}: {
    results: ResultsState;
    type: Exclude<ResultType, ResultType.puzzles | ResultType.sprintShort | ResultType.sprintLong>;
}) {
    const result = results[type];
    const { correct, wrong } = result.answers;
    const [newWords, setNewWords] = useState<WordType[]>([]);
    const [newLearned, setNewLearned] = useState<WordType[]>([]);

    const { user } = useAppSelector(state => state.persist.auth);

    const [updateUserResults] = useUpdateUserResultsMutation();

    useEffect(
        () => () => {
            updateUserResults({
                userId: user!.localId,
                type: type === ResultType.sprint && "type" in result ? result.type : type,
                data: {
                    date: Date.now(),
                    score: result.total,
                    accuracy: getPercent(correct.length + wrong.length, correct.length),
                    encountered: newWords.length,
                    learned: newLearned.length,
                    time: "time" in result ? result.time : 0,
                },
                tokenId: user!.idToken,
            });
        },

        [],
    );

    const { data: userWords, isSuccess } = useGetUserWordsQuery(
        {
            userId: user?.localId || "localId",
            tokenId: user?.idToken || "idToken",
        },
        {
            skip: !user,
        },
    );

    const [addToUserWords] = useAddToUserWordsMutation();

    useEffect(() => {
        if (isSuccess && user) {
            if (!userWords) {
                const resultForSave: WordWithIdType = {};

                correct.forEach(word => {
                    resultForSave[word.id] = { ...word, guessed: 1 };
                });

                wrong.forEach(word => {
                    resultForSave[word.id] = { ...word, guessed: 0 };
                });

                addToUserWords({
                    userId: user?.localId,
                    data: resultForSave,
                    tokenId: user!.idToken,
                });

                setNewWords([...correct, ...wrong]);
            } else {
                const resultForSave: WordWithIdType = {};

                wrong.forEach(word => {
                    const prevData = userWords[word.id] || word;
                    resultForSave[word.id] = { ...prevData, guessed: 0 };
                });

                const tempNewLearned: WordType[] = [];

                correct.forEach(word => {
                    const prevData = userWords[word.id] || word;

                    const max = userWords[word.id]?.difficult ? 5 : 3;

                    const prevGuessed = userWords[word.id]?.guessed || 0;

                    const guessed = prevGuessed + 1 <= max ? prevGuessed + 1 : prevGuessed;

                    const learned = max === prevGuessed + 1 && max !== prevGuessed;

                    resultForSave[word.id] = {
                        ...prevData,
                        guessed,
                        learned,
                    };

                    if (learned) {
                        tempNewLearned.push(word);
                    }
                });

                setNewLearned(tempNewLearned);

                addToUserWords({
                    userId: user?.localId,
                    data: resultForSave,
                    tokenId: user!.idToken,
                });

                setNewWords([...correct, ...wrong].filter(word => !Object.keys(userWords).includes(word.id)));
            }
        }
    }, [isSuccess]);

    return (
        <StyledGameResultContent>
            <StyledGameResultContentItem>
                <h4>{`Correct (${correct.length}):`}</h4>
                {!user || (!newWords.length && !newLearned.length) ? (
                    <WordList data={correct} />
                ) : (
                    <WordList data={correct} encountered={newWords} learned={newLearned} />
                )}
            </StyledGameResultContentItem>
            <StyledGameResultContentItem>
                <h4>{`Wrong (${wrong.length}):`}</h4>
                {!user || (!newWords.length && !newLearned.length) ? (
                    <WordList data={wrong} />
                ) : (
                    <WordList data={wrong} encountered={newWords} learned={newLearned} />
                )}
            </StyledGameResultContentItem>
        </StyledGameResultContent>
    );
}

export default GameResultDetailed;
