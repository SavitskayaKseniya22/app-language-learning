import type { Word } from "@/entities/user";

export interface WordForDrop {
    key: string;
    element: string;
}
export interface DropData {
    source: WordForDrop[];
    result: WordForDrop[];
}

export type DnDWordType = Word & {
    dnd: DropData;
};
