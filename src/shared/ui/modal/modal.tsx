/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import type React from "react";
import { useCallback, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import ModalContext from "./modal-context";
import styles from "./modal.module.scss";
import { Button } from "@/shared/ui/button";
import clsx from "clsx";

const useManipulateContainerScroll = () => {
    const blockScroll = useCallback(() => {
        const root = document.querySelector("#main-container") as HTMLElement;

        if (root) {
            root.style.overflow = "hidden";
            root.style.height = "100svh";
        }
    }, []);

    const unBlockScroll = useCallback(() => {
        const root = document.querySelector("#main-container") as HTMLElement;

        if (root) {
            root.style.overflow = "";
            root.style.height = "auto";
        }
    }, []);

    return { blockScroll, unBlockScroll };
};

function ReactPortal({ children }: { children: React.ReactNode }) {
    return createPortal(children, document.querySelector("#root") as HTMLElement);
}

function Modal() {
    const { content, setContent } = useContext(ModalContext);
    const { blockScroll, unBlockScroll } = useManipulateContainerScroll();

    useEffect(() => {
        if (content) {
            blockScroll();
        } else {
            unBlockScroll();
        }
    }, [blockScroll, content, unBlockScroll]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setContent(null);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [setContent]);

    if (!content) return null;

    return (
        <ReactPortal>
            <div
                className={styles.modal}
                onClick={event => {
                    if (event.currentTarget === event.target) {
                        setContent(null);
                    }
                }}>
                <div
                    className={clsx(
                        styles.modal__container,
                        content.options?.size && styles[`modal__container--${content.options?.size}`],
                    )}
                    role="dialog"
                    aria-modal="true">
                    <div className={styles.modal__header}>
                        <div>
                            {content.title && <h2 className={styles.modal__title}>{content.title}</h2>}
                            {content.subTitle && <p className={styles["modal__title--sub"]}>{content.subTitle}</p>}
                        </div>

                        <Button
                            type="button"
                            view="transparent"
                            className={styles.modal__button}
                            onClick={() => {
                                setContent(null);
                            }}
                            title="Close">
                            <i className="fa-solid fa-xmark" />
                        </Button>
                    </div>

                    {content.body}
                </div>
            </div>
        </ReactPortal>
    );
}

export default Modal;
