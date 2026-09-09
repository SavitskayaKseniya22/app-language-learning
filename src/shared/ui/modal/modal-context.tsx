import type { SizeType } from "@/shared/types/interfaces";
import { createContext } from "react";

export type ModalContentType = {
    body: React.ReactNode;
    title?: string;
    subTitle?: string;
    options?: { size: SizeType };
};

const ModalContext = createContext<{
    content: ModalContentType | null;
    setContent: React.Dispatch<React.SetStateAction<ModalContentType | null>>;
}>(
    {} as {
        content: ModalContentType | null;
        setContent: React.Dispatch<React.SetStateAction<ModalContentType | null>>;
    },
);

export default ModalContext;
