import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { ModalContext } from "../../../shared/ui/modal";
import styles from "./games-list.module.scss";
import type { Word } from "@/entities/user";
import { StyledIcon } from "@/shared/ui/styled-icon";
import { Badge } from "@/shared/ui/badge";
import clsx from "clsx";
import type { SizeType } from "@/shared/types/interfaces";
import { gamesLabels } from "@/entities/game";

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
                    <StyledIcon size={size}>
                        <i className="fa-solid fa-stopwatch"></i>
                    </StyledIcon>
                    <div className={styles.list__content}>
                        <div className={styles.list__description}>
                            <h3>Sprint</h3>

                            <p className={clsx(styles.list__note, styles[`list__note--${size}`])}>
                                {data ? gamesLabels.sprint.description.main : gamesLabels.sprint.description.sub}
                            </p>
                        </div>
                        <Badge size={size}>Meaning</Badge>
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
                    <StyledIcon size={size}>
                        <i className="fa-solid fa-cubes"></i>
                    </StyledIcon>
                    <div className={styles.list__content}>
                        <div className={styles.list__description}>
                            <h3>Constructor</h3>

                            <p className={clsx(styles.list__note, styles[`list__note--${size}`])}>
                                {data
                                    ? gamesLabels.constructor.description.main
                                    : gamesLabels.constructor.description.sub}
                            </p>
                        </div>
                        <Badge size={size}>Spelling</Badge>
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
                    <StyledIcon size={size}>
                        <i className="fa-solid fa-headphones"></i>
                    </StyledIcon>
                    <div className={styles.list__content}>
                        <div className={styles.list__description}>
                            <h3>Audiocall</h3>
                            <p className={clsx(styles.list__note, styles[`list__note--${size}`])}>
                                {data ? gamesLabels.audiocall.description.main : gamesLabels.audiocall.description.sub}
                            </p>
                        </div>
                        <Badge size={size}>Listening</Badge>
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
                    <StyledIcon size={size}>
                        <i className="fa-solid fa-puzzle-piece"></i>
                    </StyledIcon>
                    <div className={styles.list__content}>
                        <div className={styles.list__description}>
                            <h3>Puzzles</h3>
                            <p className={clsx(styles.list__note, styles[`list__note--${size}`])}>
                                {data ? gamesLabels.puzzles.description.main : gamesLabels.puzzles.description.sub}
                            </p>
                        </div>
                        <Badge size={size}>Grammar</Badge>
                    </div>
                </NavLink>
            </li>
        </ul>
    );
}
