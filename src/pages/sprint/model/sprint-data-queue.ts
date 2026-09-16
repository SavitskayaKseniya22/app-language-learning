import type { Word } from "@/entities/user";
import type { SprintWordsType } from "@/pages/sprint/model/sprint-types";
import { getRandom } from "@/shared/lib/math";

export class DataQueue {
    elements: Word[] = [];

    words: SprintWordsType;

    usedElementsIds: number[];

    constructor({ elements }: { elements: Word[] }) {
        this.elements = elements;

        this.usedElementsIds = [];
        this.words = this.nextPair();
    }

    createSecondIndex(firstIndex: number) {
        return Math.random() <= 0.5 ? firstIndex : getRandom(0, this.elements.length - 1);
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

    nextPair(): SprintWordsType {
        if (this.isEmpty) {
            throw new Error("DataQueue requires at least 2 elements to create a pair");
        }

        const firstIndex = this.getRandomAvailableIndex();

        if (firstIndex === null) {
            throw new Error("Can't find a word");
        }

        const first = this.elements[firstIndex];

        const secondIndex = this.createSecondIndex(firstIndex);

        const second = this.elements[secondIndex];

        this.usedElementsIds.push(first.id);

        this.words = {
            first,
            second,
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

    checkIfAnswerCorrect(value: string, firstWord: Word, secondWord: Word) {
        return (
            (value === "true" && firstWord.id === secondWord.id) ||
            (value === "false" && firstWord.id !== secondWord.id)
        );
    }
}
