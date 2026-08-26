import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import React from "react";
import type { DnDWordType, FirebaseAuthErrorTypes, WordType } from "../types/interfaces";
import {  WordBaseValues } from "../types/interfaces";
import { GameType } from "@/app/api/user-api";

export function getRandom(min: number, max: number) {
    return Math.trunc(Math.random() * (max + 1 - min) + min);
}

export function getResultMessage(percent: number) {
    const messages = [
        "Next time will be better!",
        "You can do better!",
        "Nice! You start learning!",
        "Almost done!",
        "You are a native now. Congrats!",
    ];

    return messages[Math.round(percent / 25)];
}

export function getPercent(total: number, correct: number) {
    return Math.round((correct / total || 0) * 100);
}

export function checkIfAnswerCorrect(value: string, firstWord: WordType, secondWord: WordType) {
    return (
        (value === "true" && firstWord.id === secondWord.id) || (value === "false" && firstWord.id !== secondWord.id)
    );
}

export function shuffle<T>(array: Array<T>): Array<T> {
    const arrayCopy = [...array];
    for (let index = array.length - 1; index > 0; index -= 1) {
        const index_ = Math.floor(Math.random() * (index + 1));
        [arrayCopy[index], arrayCopy[index_]] = [arrayCopy[index_], arrayCopy[index]];
    }
    return arrayCopy;
}

export function convertArray(array: string[]) {
    return array.map(item => ({
        element: item,
        key: Math.random().toString(),
    }));
}

export function getRandomItemsFromArray<T>(array: Array<T>, value: number): Array<T> {
    return shuffle(array).slice(0, value);
}

export function makeEmptyArrayWithIds(length: number) {
    return convertArray(Array.from({ length }, () => "0"));
}

export function transformAuthError(response: FetchBaseQueryError) {
    const { message } = (response.data as FirebaseAuthErrorTypes).error;
    return {
        code: response.status,
        message: message.toLowerCase().replaceAll("_", " "),
    };
}

export function fetchAndCreateReactImage(partOfUrl: string) {
    return fetch(`https://raw.githubusercontent.com/SavitskayaKseniya22/rslang-data/data/${partOfUrl}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.blob();
        })
        .then(response =>
            React.createElement("img", {
                src: URL.createObjectURL(response),
            }),
        );
}

export function divideSentence({ sentence, difficulty }: { sentence: string; difficulty: number }) {
    const array = sentence.split(" ");
    const partition = [4, 6, array.length][difficulty];

    const maxWordsInPart = Math.round(array.length / partition);

    let dividedSentence: string[] = [];

    while (array.length >= maxWordsInPart) {
        const part = array.splice(0, maxWordsInPart);

        dividedSentence = [...dividedSentence, part.join(" ")];
    }

    return [...dividedSentence, ...array];
}

export function createSecondIndex(basicIndex: number, maxIndex: number) {
    return Math.random() <= 0.5 ? basicIndex : getRandom(WordBaseValues.MINWORD, maxIndex);
}

export class DataQueue {
    elements: WordType[] = [];

    head: number = 0;

    tail: number;

    startLength: number;

    initialGroup: string;

    constructor({ elements, group }: { elements: WordType[]; group: string }) {
        this.elements = elements;
        this.tail = elements.length;
        this.startLength = elements.length;
        this.initialGroup = group;
    }

    next() {
        const item = this.elements[this.head];
        this.head += 1;
        return item;
    }

    nextPuzzle(difficulty: string): DnDWordType {
        const item = this.elements[this.head];
        this.head += 1;
        return {
            ...item,
            dnd: {
                source: shuffle(
                    convertArray(
                        divideSentence({
                            sentence: item.textExample,
                            difficulty: +difficulty,
                        }),
                    ),
                ),
                result: [],
            },
        };
    }

    nextWordLikeArray() {
        const item = this.elements[this.head];
        this.head += 1;
        const letters = [...item.word].map((letter, index) => ({ letter, key: Math.random(), index: index }));

        return {
            ...item,
            letters,
            shuffledLetters: shuffle(letters),
        };
    }

    nextPair() {
        const first = this.elements[this.head];
        const secondIndex = createSecondIndex(this.head, this.tail - 1);
        const second = this.elements[secondIndex];
        this.head += 1;
        return { first, second };
    }

    nextFour() {
        let elements = [...this.elements];

        const excludedElements = [this.elements[this.head]];

        while (excludedElements.length !== 5) {
            elements = elements.filter(element => element.id !== excludedElements.at(-1)?.id);

            const index = getRandom(WordBaseValues.MINWORD, elements.length - 1);
            excludedElements.push(elements[index]);
        }

        this.head += 1;
        return { ref: excludedElements[0], others: shuffle(excludedElements) };
    }

    get length() {
        return this.tail - this.head;
    }

    get isEmpty() {
        return this.length === 0;
    }

    get words() {
        return this.elements;
    }

    get group() {
        return this.initialGroup;
    }
}

export function checkStepValue({ difficulty, type }: { difficulty: string; type: GameType }) {
    switch (type) {
        case GameType.puzzles: {
            return [5, 10, 15][+difficulty];
        }

        case GameType.constructor: {
            return [5, 10, 15, 20, 25, 30][+difficulty];
        }

        default: {
            return 10;
        }
    }
}

export function checkSubtrahendValue({ difficulty, type }: { difficulty: string; type: GameType }) {
    switch (type) {
        case GameType.puzzles: {
            return [1, 5, 10][+difficulty];
        }

        case GameType.constructor: {
            return [1, 3, 7, 10, 15, 20][+difficulty];
        }

        default: {
            return 1;
        }
    }
}

export function getParcedTime({ time }: { time: number }) {
    const seconds = time % 60;
    const minutes = Math.floor(time / 60);
    const hours = Math.floor(minutes / 60);
    return { hours, minutes: minutes % 60, seconds };
}

export function makeLineFromParcedTime({
    hours,
    minutes,
    seconds,
}: {
    hours: number;
    minutes: number;
    seconds: number;
}) {
    const hoursString = hours.toString().length === 1 ? `0${hours}` : `${hours}`;
    const minutesString = minutes.toString().length === 1 ? `0${minutes}` : `${minutes}`;
    const secondsString = seconds.toString().length === 1 ? `0${seconds}` : `${seconds}`;

    return `${hoursString}:${minutesString}:${secondsString}`;
}

export const generateRandomString = () => Math.floor(Math.random() * Date.now()).toString(36);
