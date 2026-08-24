import type React from "react";
import { useState } from "react";
import Modal from "./modal";
import ModalContext from "./modal-context";

function ModalProvider({ children }: { children: React.ReactNode }) {
    const [content, setContent] = useState<React.ReactNode | null>(null);

    return (
        <ModalContext.Provider
            value={{
                content,
                setContent,
            }}>
            {children}
            <Modal />
        </ModalContext.Provider>
    );
}

export default ModalProvider;
