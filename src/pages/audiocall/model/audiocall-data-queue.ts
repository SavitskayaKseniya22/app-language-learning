import type { Word } from "@/entities/user";
import { getRandom } from "@/shared/lib/math";
import type { AudiocallWordsType } from "./audiocall-types";

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

    words: AudiocallWordsType;

    usedElementsIds: number[];

    constructor({ elements }: { elements: Word[] }) {
        this.elements = elements;

        this.usedElementsIds = [];
        this.words = this.nextFive();
    }

    createAdditionalIndexes(firstIndex: number): number[] {
        const availableIndexes = this.elements.map((_, index) => index).filter(index => index !== firstIndex);

        const indexes: number[] = [];

        while (indexes.length < 4 && availableIndexes.length > 0) {
            const randomIndex = getRandom(0, availableIndexes.length - 1);

            indexes.push(availableIndexes[randomIndex]);
            availableIndexes.splice(randomIndex, 1);
        }

        return indexes;
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

    nextFive(): AudiocallWordsType {
        const firstIndex = this.getRandomAvailableIndex();

        if (firstIndex === null) {
            throw new Error("Can't find a word");
        }

        const additionalIndexes = this.createAdditionalIndexes(firstIndex);

        const first = this.elements[firstIndex];

        const others = additionalIndexes.map(index => this.elements[index]);

        this.usedElementsIds.push(first.id);

        this.words = {
            ref: first,
            others: shuffle([...others, first]),
        };

        return this.words;
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
