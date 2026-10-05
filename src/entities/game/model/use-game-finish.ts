import { useRef, useState } from "react";
import { toast } from "react-toastify";

// Keep the game frozen after it ends, including while a failed save is retried.
export function useGameFinish(onFinish: () => Promise<void>) {
    const [phase, setPhase] = useState<"playing" | "saving" | "failed" | "finished">("playing");
    const pending = useRef(false);
    const ended = useRef(false);

    const finish = () => {
        if (pending.current) return;
        pending.current = true;
        ended.current = true;
        setPhase("saving");

        void onFinish().then(
            () => setPhase("finished"),
            () => {
                pending.current = false;
                setPhase("failed");
                toast.error("Can't save result. Please try again.");
            },
        );
    };

    return {
        finish,
        ended,
        hasEnded: phase !== "playing",
        isSaving: phase === "saving",
        saveFailed: phase === "failed",
    };
}
