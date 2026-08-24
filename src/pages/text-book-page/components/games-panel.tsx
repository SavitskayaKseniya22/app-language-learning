import { useContext } from "react";
import { Link } from "react-router-dom";
import ModalContext from "../../../components/modal/modal-context";
import type { WordType } from "../../../shared/types/interfaces";
import { StyledGameItem, StyledGameList } from "../../games/games";

function GamesPanel({ data, group }: { data: WordType[]; group: string }) {
    const { setContent } = useContext(ModalContext);

    return (
        <StyledGameList>
            <StyledGameItem>
                <Link
                    to="/games/sprint/game"
                    state={{ data }}
                    onClick={() => {
                        setContent(null);
                    }}>
                    <h4>Sprint</h4>
                </Link>
            </StyledGameItem>
            <StyledGameItem>
                <Link
                    to="/games/constructor/game"
                    state={{ data, group }}
                    onClick={() => {
                        setContent(null);
                    }}>
                    <h4>Constructor</h4>
                </Link>
            </StyledGameItem>
            <StyledGameItem>
                <Link
                    to="/games/audiocall/game"
                    state={{ data }}
                    onClick={() => {
                        setContent(null);
                    }}>
                    <h4>Audiocall</h4>
                </Link>
            </StyledGameItem>
            <StyledGameItem>
                <Link
                    to="/games/puzzles"
                    state={{ data }}
                    onClick={() => {
                        setContent(null);
                    }}>
                    <h4>Puzzles</h4>
                </Link>
            </StyledGameItem>
        </StyledGameList>
    );
}

export default GamesPanel;
