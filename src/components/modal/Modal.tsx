import type React from "react";
import { useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import ModalContext from "./modal-context";

function ReactPortal({ children }: { children: React.ReactNode }) {
    return createPortal(children, document.querySelector("#root") as HTMLElement);
}

const StyledModalOuterContainer = styled("div")`
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 130;
    padding: 4rem 1rem;
    top: 0;
    overflow: auto;
`;

const StyledModalInnerContainer = styled("div")`
    min-width: 200px;
    min-height: 200px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
`;

const StyledModalButton = styled("button")`
    position: absolute;
    top: 1rem;
    right: 1rem;
    color: white;
    font-size: 2rem;
    z-index: 150;
`;

function Modal() {
    const { content, setContent } = useContext(ModalContext);

    useEffect(() => {
        document.body.style.overflow = content ? "hidden" : "unset";
    }, [content]);

    if (!content) return null;

    return (
        <ReactPortal>
            <StyledModalOuterContainer
                onClick={event => {
                    if (event.currentTarget === event.target) {
                        setContent(null);
                    }
                }}>
                <StyledModalButton
                    type="button"
                    onClick={() => {
                        setContent(null);
                    }}
                    title="Close">
                    <i className="fa-solid fa-xmark" />
                </StyledModalButton>
                <StyledModalInnerContainer>{content}</StyledModalInnerContainer>
            </StyledModalOuterContainer>
        </ReactPortal>
    );
}

export default Modal;
