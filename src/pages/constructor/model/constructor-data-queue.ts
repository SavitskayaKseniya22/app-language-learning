import type { Word } from "@/entities/user";
import { getRandom } from "@/shared/lib/math";

function shuffle<T>(array: Array<T>): Array<T> {
    const arrayCopy = [...array];
    for (let index = array.length - 1; index > 0; index -= 1) {
        const index_ = Math.floor(Math.random() * (index + 1));
        [arrayCopy[index], arrayCopy[index_]] = [arrayCopy[index_], arrayCopy[index]];
    }
    return arrayCopy;
}

export class DataQueue {
    elements: Word[] = [];
    word: Word & {
        letters: {
            value: string;
            key: `${string}-${string}-${string}-${string}-${string}`;
            index: number;
        }[];
    };

    usedElementsIds: number[];

    constructor({ elements }: { elements: Word[] }) {
        this.elements = elements;
        this.usedElementsIds = [];
        this.word = this.nextWordLikeArray();
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

    nextWordLikeArray() {
        if (this.isEmpty) {
            throw new Error("DataQueue requires at least 2 elements to create a pair");
        }

        const firstIndex = this.getRandomAvailableIndex();

        if (firstIndex === null) {
            throw new Error("Can't find a word");
        }
        const item = this.elements[firstIndex];

        const letters = [...item.word].map((value, index) => ({ value, key: crypto.randomUUID(), index: index }));

        this.usedElementsIds.push(item.id);

        this.word = {
            ...item,
            letters: shuffle(letters),
        };

        return this.word;
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
