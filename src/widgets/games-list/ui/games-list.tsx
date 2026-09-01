import { useContext } from "react";
import { Link } from "react-router-dom";
import ModalContext from "../../../components/modal/modal-context";
import styles from "./games-list.module.scss";
import type { Word } from "@/app/api/user-api";
import clsx from "clsx";

export default function GamesList({ data }: { data: Word[] }) {
    const { setContent } = useContext(ModalContext);

    return (
        <div className={styles.list}>
            <h2>Choose a game</h2>
            <ul className={styles.list__games}>
                <li className={clsx(styles.list__item, styles["list__item--sprint"])}>
                    <Link
                        to="/games/sprint/game"
                        state={{ data }}
                        onClick={() => {
                            setContent(null);
                        }}>
                        <h3>Sprint</h3>
                    </Link>
                </li>
                <li className={clsx(styles.list__item, styles["list__item--constructor"])}>
                    <Link
                        to="/games/constructor/game"
                        state={{ data }}
                        onClick={() => {
                            setContent(null);
                        }}>
                        <h3>Constructor</h3>
                    </Link>
                </li>
                <li className={clsx(styles.list__item, styles["list__item--audiocall"])}>
                    <Link
                        to="/games/audiocall/game"
                        state={{ data }}
                        onClick={() => {
                            setContent(null);
                        }}>
                        <h3>Audiocall</h3>
                    </Link>
                </li>
                <li className={clsx(styles.list__item, styles["list__item--puzzle"])}>
                    <Link
                        to="/games/puzzles"
                        state={{ data }}
                        onClick={() => {
                            setContent(null);
                        }}>
                        <h3>Puzzles</h3>
                    </Link>
                </li>
            </ul>
        </div>
    );
}
