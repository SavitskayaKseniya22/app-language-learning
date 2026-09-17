/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import type { DropResult } from "@hello-pangea/dnd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import { useAppDispatch } from "../../../../app/store/store";
import type { WordForDrop, DnDWordType, DropData } from "../../model/puzzle-types";
import { updateMiddlePuzzleState } from "../../model/puzzle-slice";
import styles from "./puzzle-dnd.module.scss";

const reorder = (list: WordForDrop[], startIndex: number, endIndex: number) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export default function DragAndDrop({ word }: { word: DnDWordType }) {
    const dispatch = useAppDispatch();

    const [sentence, setSentence] = useState<DropData>(word.dnd);

    const updateSentense = (data: DropData) => {
        if (data.source.length === 0) {
            const istItCorrect = word.text_example === data.result.map(item => item.element).join(" ");

            dispatch(
                updateMiddlePuzzleState({
                    middleResult: istItCorrect,
                }),
            );
        }

        setSentence(data);
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const { source, destination } = result;

        if (source.droppableId === destination.droppableId) {
            const { droppableId } = source;
            const items = reorder(sentence[droppableId as "source" | "result"], source.index, destination.index);
            updateSentense({ ...sentence, [droppableId]: items });
        }

        if (source.droppableId !== destination.droppableId) {
            if (source.droppableId === "source") {
                const changedSource = [...sentence.source];
                const [removed] = changedSource.splice(source.index, 1);

                const changedResult = [...sentence.result];
                changedResult.splice(destination.index, 0, removed);

                updateSentense({
                    ...sentence,
                    source: changedSource,
                    result: changedResult,
                });
            } else if (source.droppableId === "result") {
                const changedResult = [...sentence.result];
                const [removed] = changedResult.splice(source.index, 1);

                const changedSource = [...sentence.source];
                changedSource.splice(destination.index, 0, removed);

                updateSentense({
                    ...sentence,
                    source: changedSource,
                    result: changedResult,
                });
            }
        }
    };

    return (
        <div className={styles.dnd}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="result" direction="horizontal">
                    {provided => (
                        <ul
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={styles["dnd__element--droppable"]}>
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
                        <ul
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={styles["dnd__element--dragabble"]}>
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

                                                updateSentense({
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
        </div>
    );
}
