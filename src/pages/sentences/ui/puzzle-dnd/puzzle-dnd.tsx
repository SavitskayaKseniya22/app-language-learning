/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import type { DropResult, ResponderProvided } from "@hello-pangea/dnd";
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

export default function DragAndDrop({ word, disabled = false }: { word: DnDWordType; disabled?: boolean }) {
    const dispatch = useAppDispatch();

    const [sentence, setSentence] = useState<DropData>(word.dnd);

    const updateSentense = (data: DropData) => {
        if (disabled) return;
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

    const onDragEnd = (result: DropResult, { announce }: ResponderProvided) => {
        announce(result.destination ? "Фрагмент перемещён." : "Перемещение отменено.");
        if (disabled || !result.destination) {
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
            <DragDropContext
                onDragEnd={onDragEnd}
                dragHandleUsageInstructions="Нажмите пробел, чтобы начать перемещение. Используйте стрелки для выбора позиции, пробел для подтверждения и Escape для отмены."
                onDragStart={(_start, { announce }) => announce("Фрагмент выбран для перемещения.")}
                onDragUpdate={(update, { announce }) =>
                    announce(
                        update.destination
                            ? `Новая позиция: ${update.destination.index + 1}.`
                            : "Выберите область для размещения фрагмента.",
                    )
                }>
                <Droppable droppableId="result" direction="horizontal">
                    {provided => (
                        <ul ref={provided.innerRef} {...provided.droppableProps} className={styles.dnd__list}>
                            {sentence.result.map((item, index) => (
                                <Draggable
                                    key={item.key}
                                    draggableId={item.key}
                                    index={index}
                                    isDragDisabled={disabled}>
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
                        <ul ref={provided.innerRef} {...provided.droppableProps} className={styles.dnd__list}>
                            {sentence.source.map((item, index) => (
                                <Draggable
                                    key={item.key}
                                    draggableId={item.key}
                                    index={index}
                                    isDragDisabled={disabled}>
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
