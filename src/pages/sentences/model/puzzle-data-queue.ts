import type { Word } from "@/entities/user";
import type { DnDWordType } from "./puzzle-types";
import { getRandom } from "@/shared/lib/math";

export function shuffle<T>(array: Array<T>): Array<T> {
    const arrayCopy = [...array];
    for (let index = array.length - 1; index > 0; index -= 1) {
        const index_ = Math.floor(Math.random() * (index + 1));
        [arrayCopy[index], arrayCopy[index_]] = [arrayCopy[index_], arrayCopy[index]];
    }
    return arrayCopy;
}

export class DataQueue {
    elements: Word[] = [];

    word: DnDWordType;

    usedElementsIds: number[];
    complexity: number;

    constructor({ elements, complexity = 0 }: { elements: Word[]; complexity?: number }) {
        this.elements = elements;

        this.usedElementsIds = [];

        this.complexity = complexity - 1;
        this.word = this.nextPuzzle();
    }

    getRandomAvailableIndex(): number | null {
        const availableIndexes = this.elements
            .map((item, index) => ({ id: item.id, index }))
            .filter(({ id }) => !this.usedElementsIds.includes(id))
            .map(({ index }) => index);

        if (availableIndexes.length === 0) {
            return null;
        }

        return availableIndexes[getRandom(0, availableIndexes.length - 1)];
    }

    nextPuzzle(): DnDWordType {
        if (this.isEmpty) {
            throw new Error("DataQueue requires at least 1 element to create a sentence");
        }

        const firstIndex = this.getRandomAvailableIndex();

        if (firstIndex === null) {
            throw new Error("Can't find a word");
        }

        const first = this.elements[firstIndex];

        this.usedElementsIds.push(first.id);

        this.word = {
            ...first,
            dnd: {
                source: shuffle(
                    this.convertArray(
                        this.divideSentence({
                            sentence: first.text_example,
                        }),
                    ),
                ),
                result: [],
            },
        };

        return this.word;
    }

    convertArray(array: string[]) {
        return array.map(item => ({
            element: item,
            key: crypto.randomUUID(),
        }));
    }

    divideSentence({ sentence }: { sentence: string }) {
        const array = sentence.split(" ");
        const partition = [3, 5, array.length][this.complexity];

        const maxWordsInPart = Math.round(array.length / partition);

        let dividedSentence: string[] = [];

        while (array.length >= maxWordsInPart) {
            const part = array.splice(0, maxWordsInPart);

            dividedSentence = [...dividedSentence, part.join(" ")];
        }

        return [...dividedSentence, ...array];
    }

    get length() {
        return this.elements.length;
    }

    get progress() {
        return this.usedElementsIds.length;
    }

    get isEmpty() {
        return this.elements.length === this.usedElementsIds.length;
    }

    get all() {
        return this.elements;
    }
}
