import React, { useState } from "react";
import Modal from "./Modal";
import ModalContext from "./ModalContext";

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
