/* eslint-disable jsx-a11y/media-has-caption */
import { useRef } from "react";
import styled from "styled-components";
import { getWordAssetUrl } from "@/entities/user";
import type { ActiveWordsType } from "../../model/sprint-types";

const StyledActiveWordsList = styled("div")`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    text-align: center;

    .audible {
        cursor: pointer;
    }

    audio {
        display: none;
    }
`;

export default function SprintWordsPair({ words }: { words: ActiveWordsType }) {
    const audio = useRef<HTMLAudioElement>(null);

    return (
        <StyledActiveWordsList>
            <button
                onClick={() => {
                    void audio.current?.play();
                }}>
                <h2 title="listen" className="audible">
                    {words.first.word}
                </h2>
            </button>

            <i className="fa-solid fa-arrows-up-down" />
            <h3>{words.second.word_translate}</h3>

            <audio ref={audio} src={getWordAssetUrl(words.first.audio)} />
        </StyledActiveWordsList>
    );
}
