import { createContext } from "react";

const ModalContext = createContext<{
    content: React.ReactNode | null;
    setContent: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
}>(
    {} as {
        content: React.ReactNode | null;
        setContent: React.Dispatch<React.SetStateAction<React.ReactNode | null>>;
    },
);

export default ModalContext;
