export enum GameDifficultyType {
    SPRINT = 6,
    AUDIOCALL = 6,
    PUZZLES = 3,
    CONSTRUCTOR = 6,
}

export enum WordBaseValues {
    MINGROUP = 0,
    MAXGROUP = 5,
    MINPAGE = 0,
    MAXPAGE = 29,
    MAXWORD = 19,
    MINWORD = 0,
}

export enum StreakValues {
    MIN = 0,
    MAX = 3,
}

export enum StepValues {
    MIN = 10,
}

export enum ScreenSize {
    MOBILE = "(min-width: 320px)",
    TABLET = "(min-width: 768px)",
    LAPTOPS = "(min-width: 1024px)",
    DESKTOP = "(min-width: 1920px)",
}
export enum CollectionType {
    DIFFICULT = "difficult",
    LEARNED = "learned",
    SELECTED = "selected",
}

export interface FirebaseErrorTypes {
    error: {
        status: string;
        data: { error: string };
    };
    isUnhandledError: boolean;
    meta: {
        request: {};
        response: {};
    };
}

export interface FirebaseAuthErrorTypes {
    error: {
        errors: [
            {
                domain: string;
                reason: string;
                message: string;
            },
        ];
        code: number;
        message: string;
    };
}

export interface ActiveUserTypes {
    kind: string;
    localId: string;
    email: string;
    displayName: string;
    idToken: string;
    registered: boolean;
    refreshToken: string;
    expiresIn: string;
    profilePicture: string;
}

export interface BasicUserCredentials {
    email: string;
    password: string;
}

export type SubtrahendType = { subtrahend: number };

export type GroupType = { group: string };

export type PageType = { page: number };

export type TextBookValuesTypes = GroupType & PageType;

export type TotalType = { total: number };

export type StepType = { step: number };

export type StreakType = { streak: number };

export type TimeType = { time: number };

export type PointsType = StepType & TotalType;

export type AnswersType = {
    answers: { correct: WordType[]; wrong: WordType[] };
};

export type ProgressType = TotalType & StreakType;

export type WordType = PageType &
    GroupType & {
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
    };

export interface ActiveWordsTypes {
    first: WordType;
    second: WordType;
}

export interface WordForDrop {
    key: string;
    element: string;
}

export interface DropData {
    source: WordForDrop[];
    result: WordForDrop[];
}

export type DnDWordType = WordType & {
    dnd: DropData;
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

export interface CollectionLikeArraysType {
    [CollectionType.DIFFICULT]: WordWithIdDataType[];
    [CollectionType.LEARNED]: WordWithIdDataType[];
    [CollectionType.SELECTED]: WordWithIdDataType[];
    all: WordWithIdDataType[];
}

export type TokenIdType = { tokenId: string };

export type UserIdType = { userId: string };

export type WordIdType = { wordId: string };

export interface Users {
    [userId: string]: UserIdType & {
        words: WordWithIdType;
    };
}

export enum ResultType {
    sprint = "sprint",
    audiocall = "audiocall",
    constructor = "constructor",
    puzzles = "puzzles",
    sprintShort = "sprintShort",
    sprintLong = "sprintLong",
}

export type ComplicatedResultType = AnswersType & PointsType & StreakType;

export type ResultsState = {
    [ResultType.audiocall]: ComplicatedResultType;
    [ResultType.sprint]: ComplicatedResultType & {
        type: ResultType.sprintShort | ResultType.sprintLong;
    };
    [ResultType.constructor]: AnswersType & PointsType & SubtrahendType & TimeType;

    [ResultType.puzzles]: { middleResult: boolean } & PointsType & {
            correct: number;
            wrong: number;
        } & SubtrahendType &
        TimeType;
};

export type UpdateResultType = {
    isAnswerCorrect: boolean;
    word: WordType;
    time?: number;
};

export type BasicResultType = {
    date: number;
    score: number;
    accuracy: number;
};

export type WordsResultType = {
    encountered: number;
    learned: number;
};

export type StatiscticsItemType = {
    [ResultType.sprintShort]: BasicResultType & WordsResultType;
    [ResultType.sprintLong]: BasicResultType & WordsResultType;
    [ResultType.audiocall]: BasicResultType & WordsResultType;
    [ResultType.constructor]: BasicResultType & WordsResultType & TimeType;
    [ResultType.puzzles]: BasicResultType & TimeType;
};

export enum StatControlType {
    TODAY = "today",
    TOTAL = "total",
}

export type CredentialsType = UserIdType & TokenIdType;

export enum ErrorType {
    ERROR,
    PAGENOTFOUND,
}
