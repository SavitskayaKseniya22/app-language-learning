export type WordType = {
    id: string;
    word: string;
    image: string;
    audio: string;
    audioMeaning: string;
    audioExample: string;
    textMeaning: string;
    textExample: string;
    transcription: string;
    wordTranslate: string;
    textMeaningTranslate: string;
    textExampleTranslate: string;
    page: number;
    group: string;
};

export type WordWithIdDataType = WordType & {
    guessed?: number;
    difficult?: boolean;
    learned?: boolean;
    selected?: boolean;
};

export interface WordWithIdType {
    [wordId: string]: WordWithIdDataType;
}

export enum ResultType {
    sprint = "sprint",
    audiocall = "audiocall",
    constructor = "constructor",
    puzzles = "puzzles",
    sprintShort = "sprintShort",
    sprintLong = "sprintLong",
}

export type ResultsState = {
    audiocall: {
        answers: { correct: WordType[]; wrong: WordType[] };
        step: number;
        total: number;
        streak: number;
    };

    sprint: {
        type: ResultType.sprintShort | ResultType.sprintLong;
        answers: { correct: WordType[]; wrong: WordType[] };
        step: number;
        total: number;
        streak: number;
    };

    constructor: {
        answers: { correct: WordType[]; wrong: WordType[] };
        step: number;
        total: number;
        subtrahend: number;
        time: number;
    };

    puzzles: {
        middleResult: boolean;
        step: number;
        total: number;
        subtrahend: number;
        time: number;
        correct: number;
        wrong: number;
    };
};
