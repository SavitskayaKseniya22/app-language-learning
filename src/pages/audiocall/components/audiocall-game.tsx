import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import type { DataQueue } from "../../../shared/lib/utilities";
import { StyledPuzzlesGameAnswer } from "../../sentences/components/puzzles-game";
import { useAppDispatch, useAppSelector } from "../../../app/store/store";
import Points from "../../game/components/points";
import Streak from "../../game/components/streak";
import { updateAudiocallResult } from "../../../store/result-slice";
import WordAudio from "../../text-book-page/components/word-audio";
import GameInfo from "../../game/components/game-info";
import ProgressTracking from "../../game/components/progress-tracking";

const StyledAudiocallButtonList = styled("div")`
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    button {
        font-size: 1.5rem;
        padding: 1rem 2rem;
        background-color: white;
        border-radius: 1rem;
        flex-grow: 2;
        position: relative;

        i {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            font-size: 1rem;
            opacity: 0.5;
        }
    }
`;

function AudiocallGame({ data }: { data: DataQueue }) {
    const { audiocall } = useAppSelector(state => state.resultsReducer);

    const updater = useCallback(() => data.nextFour(), [data]);

    const [words, setWords] = useState(updater);

    const [middleResult, setMiddleResult] = useState<null | boolean>(null);
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const id = useRef<null | string>(null);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            switch (event.code) {
                case "Digit1": {
                    id.current = words.others[0].id;
                    break;
                }
                case "Digit2": {
                    id.current = words.others[1].id;
                    break;
                }
                case "Digit3": {
                    id.current = words.others[2].id;
                    break;
                }
                case "Digit4": {
                    id.current = words.others[3].id;
                    break;
                }
                case "Digit5": {
                    id.current = words.others[4].id;
                    break;
                }
                default: {
                    break;
                }
            }

            if (id.current) {
                dispatch(
                    updateAudiocallResult({
                        isAnswerCorrect: id.current === words.ref.id,
                        word: words.ref,
                    }),
                );
                setMiddleResult(id.current === words.ref.id);
            }
        },
        [dispatch, words.others, words.ref],
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <main>
            <GameInfo>
                <ProgressTracking streak={data.head} total={data.startLength} />
                <Points step={audiocall.step} total={audiocall.total} subtrahend={0} />
            </GameInfo>

            <div className="game__container">
                <Streak streak={audiocall.streak} total={3} />
                <WordAudio source={words.ref.audio} />
                {middleResult === null ? (
                    <>
                        <StyledAudiocallButtonList>
                            {words.others.map((element, index) => (
                                <button
                                    type="button"
                                    key={element.id}
                                    onClick={() => {
                                        dispatch(
                                            updateAudiocallResult({
                                                isAnswerCorrect: element.id === words.ref.id,
                                                word: words.ref,
                                            }),
                                        );

                                        setMiddleResult(element.id === words.ref.id);
                                    }}>
                                    {element.wordTranslate}
                                    <i>{index + 1}</i>
                                </button>
                            ))}
                        </StyledAudiocallButtonList>

                        <button
                            type="button"
                            onClick={() => {
                                setMiddleResult(false);
                                dispatch(
                                    updateAudiocallResult({
                                        isAnswerCorrect: false,
                                        word: words.ref,
                                    }),
                                );
                            }}>
                            See the correct answer
                        </button>
                    </>
                ) : (
                    <>
                        <StyledPuzzlesGameAnswer $type={middleResult ? "correct" : "wrong"}>
                            {words.ref.word} - {words.ref.wordTranslate}
                        </StyledPuzzlesGameAnswer>

                        <p>{words.ref.textMeaning}</p>

                        <button
                            type="button"
                            onClick={() => {
                                if (data.isEmpty) {
                                    navigate("/games/audiocall/result", {
                                        state: { data: data.words, group: data.group },
                                    });
                                } else {
                                    setWords(updater);
                                    setMiddleResult(null);
                                }
                            }}>
                            Next word
                        </button>
                    </>
                )}
            </div>
        </main>
    );
}

export default AudiocallGame;
