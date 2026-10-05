import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { ModalContext } from "../../../shared/ui/modal";
import styles from "./games-list.module.scss";
import type { Word } from "@/entities/user";
import { Badge } from "@/shared/ui/badge";
import clsx from "clsx";
import { gamesLabels } from "@/entities/game";
import type { SizeType } from "@/shared/types/types";

export default function GamesList({ data, size = "medium" }: { data?: Word[]; size?: SizeType }) {
    const { setContent } = useContext(ModalContext);

    return (
        <ul className={styles.list}>
            <li>
                <NavLink
                    to={data ? "/games/sprint/game" : "/games/sprint"}
                    state={{ data }}
                    onClick={() => {
                        setContent(null);
                    }}
                    className={styles.list__item}>
                    <span className={styles.list__mark}>01</span>
                    <div className={styles.list__content}>
                        <div className={styles.list__description}>
                            <h3>Спринт</h3>

                            <p className={clsx(styles.list__note, styles[`list__note--${size}`])}>
                                {data ? gamesLabels.sprint.description.main : gamesLabels.sprint.description.sub}
                            </p>
                        </div>
                        <Badge size={size}>Значение</Badge>
                    </div>
                </NavLink>
            </li>
            <li>
                <NavLink
                    to={data ? "/games/constructor/game" : "/games/constructor"}
                    state={{ data }}
                    onClick={() => {
                        setContent(null);
                    }}
                    className={styles.list__item}>
                    <span className={styles.list__mark}>02</span>
                    <div className={styles.list__content}>
                        <div className={styles.list__description}>
                            <h3>Конструктор</h3>

                            <p className={clsx(styles.list__note, styles[`list__note--${size}`])}>
                                {data
                                    ? gamesLabels.constructor.description.main
                                    : gamesLabels.constructor.description.sub}
                            </p>
                        </div>
                        <Badge size={size}>Правописание</Badge>
                    </div>
                </NavLink>
            </li>
            <li>
                <NavLink
                    to={data ? "/games/audiocall/game" : "/games/audiocall"}
                    state={{ data }}
                    onClick={() => {
                        setContent(null);
                    }}
                    className={styles.list__item}>
                    <span className={styles.list__mark}>03</span>
                    <div className={styles.list__content}>
                        <div className={styles.list__description}>
                            <h3>Аудиовызов</h3>
                            <p className={clsx(styles.list__note, styles[`list__note--${size}`])}>
                                {data ? gamesLabels.audiocall.description.main : gamesLabels.audiocall.description.sub}
                            </p>
                        </div>
                        <Badge size={size}>Аудирование</Badge>
                    </div>
                </NavLink>
            </li>
            <li>
                <NavLink
                    to={data ? "/games/puzzles/game" : "/games/puzzles"}
                    state={{ data }}
                    onClick={() => {
                        setContent(null);
                    }}
                    className={styles.list__item}>
                    <span className={styles.list__mark}>04</span>
                    <div className={styles.list__content}>
                        <div className={styles.list__description}>
                            <h3>Пазлы</h3>
                            <p className={clsx(styles.list__note, styles[`list__note--${size}`])}>
                                {data ? gamesLabels.puzzles.description.main : gamesLabels.puzzles.description.sub}
                            </p>
                        </div>
                        <Badge size={size}>Грамматика</Badge>
                    </div>
                </NavLink>
            </li>
        </ul>
    );
}
