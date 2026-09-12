import type { Word } from "../user";

export interface GameContextType {
    data: Word[];
    difficulty: number;
    complexity: number;
    isTimed: boolean;
}
