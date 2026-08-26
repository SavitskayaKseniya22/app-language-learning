import type { GameType } from "@/app/api/user-api";
import styled from "styled-components";

const StyledGameTip = styled("ul")`
    padding: 1rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    opacity: 0.7;
    align-self: flex-end;
`;

function GameTip({ type }: { type: GameType }) {
    const tips = {
        sprint: [
            "Read or listen the word. Answer if the game suggested the correct translation.",
            "Control the game using the arrows keys on your keyboard.",
            "Press the Space key to pause.",
        ],
        audiocall: [
            "Listen to the word. Choose the right translation.",
            "Use keys 1 to 5 to control game from the keyboard.",
        ],
        puzzles: [
            "Make sentences from a set of words.",
            "The number of points awarded depends on the selected difficulty and time spent.",
        ],
        constructor: ["Make a word from letters"],
    };
    return (
        <StyledGameTip className="game-tip">
            {tips[type].map(tip => (
                <li key={tip}>{tip}</li>
            ))}
        </StyledGameTip>
    );
}

export default GameTip;
