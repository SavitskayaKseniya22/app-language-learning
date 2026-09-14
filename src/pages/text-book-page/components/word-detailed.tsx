import type React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import type { WordType } from "../../../shared/types/wrong-interfaces";
import CollectionControlPanel from "./collection-control-panel";
import Spinner from "../../../shared/ui/spinner/spinner";
import { useAppSelector } from "../../../app/store/store";
import { useGetUserWordQuery } from "../../../store/user-words-api";
import { AudioButton } from "@/shared/ui/audio-button";
import { Streak } from "@/shared/ui/streak";

const StyledWordDetailed = styled("div")`
    gap: 1rem;
    display: flex;
    flex-direction: column;
    min-width: 288px;
`;

const StyledWordDetailedTitle = styled("div")`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
`;

const StyledWordDetailedMedia = styled("div")`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    position: relative;

    img {
        max-width: 100%;
        opacity: 0.6;
    }

    .media__audio {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: rgba(38, 70, 83);
    }
`;

const StyledWordDetailedContent = styled("ul")`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    li {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
`;

const StyledWordStatusPanel = styled("div")`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
`;

function fetchAndCreateReactImage(partOfUrl: string) {
    return fetch(`https://raw.githubusercontent.com/SavitskayaKseniya22/rslang-data/data/${partOfUrl}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.blob();
        })
        .then(response =>
            React.createElement("img", {
                src: URL.createObjectURL(response),
            }),
        );
}

function WordDetailed({ wordData }: { wordData: WordType }) {
    const [image, setImage] = useState<React.ReactElement | null>();
    const { user } = useAppSelector(state => state.persist.auth);

    const {
        data: wordDataDetailed,
        isSuccess,
        isLoading,
    } = useGetUserWordQuery(
        {
            userId: user?.localId || "localId",
            wordId: wordData.id,
            tokenId: user?.idToken || "tokenId",
        },
        { skip: !user },
    );

    const { word, transcription, textExample, textExampleTranslate, textMeaning, textMeaningTranslate, wordTranslate } =
        wordData;

    useEffect(() => {
        fetchAndCreateReactImage(wordData.image).then(imageTemporary => {
            setImage(imageTemporary);
        });
    }, [wordData.image]);

    if (!image || isLoading) {
        return <Spinner />;
    }

    return (
        <StyledWordDetailed>
            <StyledWordDetailedTitle>
                <h3>{word}</h3>
                <span>{transcription}</span>
                <h5>{wordTranslate}</h5>
            </StyledWordDetailedTitle>
            {user && isSuccess && (
                <StyledWordStatusPanel>
                    <CollectionControlPanel wordData={wordData} wordDataDetailed={wordDataDetailed} />
                    <Streak streak={wordDataDetailed?.guessed || 0} total={wordDataDetailed?.difficult ? 5 : 3} />
                </StyledWordStatusPanel>
            )}

            <StyledWordDetailedMedia>
                {image}
                <div className="media__audio">
                    <AudioButton path={wordData.audio} />
                </div>
            </StyledWordDetailedMedia>

            <StyledWordDetailedContent>
                <li>
                    <h4>Meanings</h4>
                    <p>{textMeaning}</p>
                    <p>{textMeaningTranslate}</p>
                </li>
                <li>
                    <h4>Examples</h4>
                    <p>{textExample}</p>
                    <p>{textExampleTranslate}</p>
                </li>
            </StyledWordDetailedContent>
        </StyledWordDetailed>
    );
}

export default WordDetailed;
