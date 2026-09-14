import { Button } from "@/shared/ui/button";
import type React from "react";
import { useEffect } from "react";
import styles from "./sprint-controls.module.scss";

export default function SprintControls({ handleClick }: { handleClick: (value: string) => void }) {
    const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { value } = event.target as HTMLButtonElement;
        handleClick(value);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === "ArrowLeft") {
                event.preventDefault();
                handleClick("false");
            } else if (event.code === "ArrowRight") {
                event.preventDefault();
                handleClick("true");
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleClick]);

    return (
        <div className={styles.buttons}>
            <Button type="button" value="false" onClick={onClick} size="big">
                false
            </Button>
            <Button type="button" value="true" onClick={onClick} size="big" view="secondary">
                true
            </Button>
        </div>
    );
}
