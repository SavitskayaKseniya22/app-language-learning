/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { DropResult, DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { WordForDrop, DropData, DnDWordType } from "../../../interfaces";
import { useAppDispatch } from "../../../store/store";
import { updatePuzzlesMiddleResult } from "../../../store/ResultSlice";

const reorder = (list: WordForDrop[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const StyledDragContainer = styled("div")<{ $isItActive: boolean }>`
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;
    pointer-events: ${props => (props.$isItActive ? "auto" : "none")};

    mask-image: ${props => (props.$isItActive ? "unset" : "linear-gradient(rgba(0, 0, 0, 1), transparent)")};

    .list_droppable,
    .list_draggable {
        border-radius: 1rem;
        background-color: rgba(38, 70, 83, 0.2);
        min-height: 3rem;
        padding: 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        font-size: smaller;
        justify-content: center;

        li {
            border-radius: 0.5rem;
            background-color: white;
            padding: 0.5rem;
            text-align: center;
        }
    }
`;

function DragAndDrop({ word, isItActive }: { word: DnDWordType; isItActive: boolean }) {
    const dispatch = useAppDispatch();

    const updater = useCallback(() => word.dnd, [word.dnd]);

    const [sentence, setSentence] = useState<DropData>(updater);

    useEffect(() => {
        setSentence(updater);
    }, [word, updater, dispatch]);

    useEffect(() => {
        if (!sentence.source.length) {
            const istItCorrect = word.textExample === sentence.result.map(item => item.element).join(" ");

            dispatch(
                updatePuzzlesMiddleResult({
                    middleResult: istItCorrect,
                }),
            );
        }
    }, [dispatch, sentence, word.textExample]);

    function onDragEnd(result: DropResult) {
        if (!result.destination) {
            return;
        }

        const { source, destination } = result;

        if (source.droppableId === destination.droppableId) {
            const { droppableId } = source;
            const items = reorder(sentence[droppableId as "source" | "result"], source.index, destination.index);
            setSentence({ ...sentence, [droppableId]: items });
        }

        if (source.droppableId !== destination.droppableId) {
            if (source.droppableId === "source") {
                const changedSource = [...sentence.source];
                const [removed] = changedSource.splice(source.index, 1);

                const changedResult = [...sentence.result];
                changedResult.splice(destination.index, 0, removed);

                setSentence({
                    ...sentence,
                    source: changedSource,
                    result: changedResult,
                });
            } else if (source.droppableId === "result") {
                const changedResult = [...sentence.result];
                const [removed] = changedResult.splice(source.index, 1);

                const changedSource = [...sentence.source];
                changedSource.splice(destination.index, 0, removed);

                setSentence({
                    ...sentence,
                    source: changedSource,
                    result: changedResult,
                });
            }
        }
    }

    return (
        <StyledDragContainer $isItActive={isItActive}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="result" direction="horizontal">
                    {provided => (
                        <ul ref={provided.innerRef} {...provided.droppableProps} className="list_droppable">
                            {sentence.result.map((item, index) => (
                                <Draggable key={item.key} draggableId={item.key} index={index}>
                                    {provided => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}>
                                            {item.element}
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>

                <Droppable droppableId="source" direction="horizontal">
                    {provided => (
                        <ul ref={provided.innerRef} {...provided.droppableProps} className="list_draggable">
                            {sentence.source.map((item, index) => (
                                <Draggable key={item.key} draggableId={item.key} index={index}>
                                    {provided => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            onClick={() => {
                                                const sourceCopy = [...sentence.source];
                                                sourceCopy.splice(index, 1);

                                                setSentence({
                                                    ...sentence,
                                                    source: sourceCopy,
                                                    result: [...sentence.result, item],
                                                });
                                            }}>
                                            {item.element}
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </StyledDragContainer>
    );
}

export default DragAndDrop;
