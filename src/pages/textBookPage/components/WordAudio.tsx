/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useState } from "react";
import styled from "styled-components";

const StyledWordAudioControl = styled("button")`
    font-size: 4rem;
`;

function WordAudio({ source }: { source: string }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    return (
        <>
            <StyledWordAudioControl
                type="button"
                onClick={() => {
                    setIsPlaying(true);
                    audioRef.current?.play();
                }}>
                {isPlaying ? <i className="fa-regular fa-circle-pause" /> : <i className="fa-regular fa-circle-play" />}
            </StyledWordAudioControl>
            <audio
                ref={audioRef}
                src={`https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/${source}`}
                onEnded={() => {
                    setIsPlaying(false);
                }}
            />
        </>
    );
}

export default WordAudio;
