/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/media-has-caption */

import React, { useRef } from "react";
import styled from "styled-components";
import { ActiveWordsTypes } from "../../../interfaces";

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

function ActiveWordsList({ words }: { words: ActiveWordsTypes }) {
    const audioRef = useRef<HTMLAudioElement>(null);

    return (
        <StyledActiveWordsList>
            <h2
                title="listen"
                className="audible"
                onClick={() => {
                    audioRef.current?.play();
                }}>
                {words.first.word}
            </h2>
            <i className="fa-solid fa-arrows-up-down" />
            <h3>{words.second.wordTranslate}</h3>

            <audio
                ref={audioRef}
                controls
                src={`https://raw.githubusercontent.com/irinainina/rslang/rslang-data/data/${words.first.audio}`}
            />
        </StyledActiveWordsList>
    );
}

export default ActiveWordsList;
