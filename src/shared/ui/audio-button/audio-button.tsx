/* eslint-disable jsx-a11y/media-has-caption */

import { useRef, useState } from "react";
import clsx from "clsx";
import styles from "./audio-button.module.scss";
import { getWordAssetUrl } from "@/entities/user";

export default function AudioButton({ path }: { path: string }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioReference = useRef<HTMLAudioElement>(null);
    const handleClick = () => {
        const audio = audioReference.current;

        if (!audio) {
            return;
        }

        if (audio.paused) {
            void audio.play();
        } else {
            audio.pause();
        }
    };

    return (
        <button
            onClick={handleClick}
            className={clsx(styles.audio, { [styles["audio--playing"]]: isPlaying })}
            type="button">
            <audio
                ref={audioReference}
                src={getWordAssetUrl(path)}
                onEnded={() => {
                    setIsPlaying(false);
                }}
                onPlay={() => {
                    setIsPlaying(true);
                }}
                onPause={() => setIsPlaying(false)}
            />
            <i className="fa-solid fa-volume-high"></i>
        </button>
    );
}
