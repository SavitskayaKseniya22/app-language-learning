import type { Word } from "@/entities/user";
import { getRandom } from "@/shared/lib/math";
import type { AudiocallWordsType } from "./audiocall-types";

export class DataQueue {
    elements: Word[] = [];

    startFive: AudiocallWordsType;

    usedElementsIds: number[];

    constructor({ elements }: { elements: Word[] }) {
        this.elements = elements;

        this.usedElementsIds = [];
        this.startFive = this.nextFive();
    }

    createAdditionalIndexes(firstIndex: number): number[] {
        const availableIndexes = this.elements.map((_, index) => index).filter(index => index !== firstIndex);

        const indexes: number[] = [];

        while (indexes.length < 4) {
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

        return {
            ref: first,
            others,
        };
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

    checkIfAnswerCorrect(value: string, firstWord: Word, secondWord: Word) {
        return (
            (value === "true" && firstWord.id === secondWord.id) ||
            (value === "false" && firstWord.id !== secondWord.id)
        );
    }
}
