import { useContext } from "react";
import { Link } from "react-router-dom";
import ModalContext from "../../../components/modal/modal-context";
import styles from "./games-list.module.scss";
import type { Word } from "@/app/api/user-api";

export default function GamesList({ data }: { data: Word[] }) {
    const { setContent } = useContext(ModalContext);

    return (
        <ul className={styles.list}>
            <li className={styles.list__item}>
                <Link
                    to="/games/sprint/game"
                    state={{ data }}
                    onClick={() => {
                        setContent(null);
                    }}>
                    <h4>Sprint</h4>
                </Link>
            </li>
            <li className={styles.list__item}>
                <Link
                    to="/games/constructor/game"
                    state={{ data }}
                    onClick={() => {
                        setContent(null);
                    }}>
                    <h4>Constructor</h4>
                </Link>
            </li>
            <li className={styles.list__item}>
                <Link
                    to="/games/audiocall/game"
                    state={{ data }}
                    onClick={() => {
                        setContent(null);
                    }}>
                    <h4>Audiocall</h4>
                </Link>
            </li>
            <li className={styles.list__item}>
                <Link
                    to="/games/puzzles"
                    state={{ data }}
                    onClick={() => {
                        setContent(null);
                    }}>
                    <h4>Puzzles</h4>
                </Link>
            </li>
        </ul>
    );
}
