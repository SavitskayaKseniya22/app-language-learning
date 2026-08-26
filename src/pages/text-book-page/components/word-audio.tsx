import { useRef, useState } from "react";
import styled from "styled-components";

const StyledWordAudioControl = styled("button")`
    font-size: 4rem;
`;

function WordAudio({ source }: { source: string }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioReference = useRef<HTMLAudioElement>(null);

    return (
        <>
            <StyledWordAudioControl
                type="button"
                onClick={() => {
                    setIsPlaying(true);
                    audioReference.current?.play();
                }}>
                {isPlaying ? <i className="fa-regular fa-circle-pause" /> : <i className="fa-regular fa-circle-play" />}
            </StyledWordAudioControl>
            <audio
                ref={audioReference}
                src={`https://raw.githubusercontent.com/SavitskayaKseniya22/rslang-data/data/${source}`}
                onEnded={() => {
                    setIsPlaying(false);
                }}
            />
        </>
    );
}

export default WordAudio;
