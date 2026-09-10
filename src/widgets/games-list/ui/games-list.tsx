import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { ModalContext } from "../../../shared/ui/modal";
import styles from "./games-list.module.scss";
import type { Word } from "@/entities/user";
import { StyledIcon } from "@/shared/ui/styled-icon";
import { Badge } from "@/shared/ui/badge";
import clsx from "clsx";
import type { SizeType } from "@/shared/types/interfaces";

export default function GamesList({ data, size = "medium" }: { data?: Word[]; size?: SizeType }) {
    const { setContent } = useContext(ModalContext);

    return (
        <ul className={styles.list}>
            <li>
                <NavLink
                    to="/games/sprint/game"
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
                                {data
                                    ? "Choose the correct translation before time runs out."
                                    : "Challenge your wit and knowledge in a fast paced and rewarding guessing game!"}
                            </p>
                        </div>
                        <Badge size={size}>Meaning</Badge>
                    </div>
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/games/constructor/game"
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
                                {data ? "Build each word from he available letters." : "Improve your spelling!"}
                            </p>
                        </div>
                        <Badge size={size}>Spelling</Badge>
                    </div>
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/games/audiocall/game"
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
                                {data
                                    ? "Listen and choose the word you hear."
                                    : "Train your ears as well as your eyes to recognise english speech!"}
                            </p>
                        </div>
                        <Badge size={size}>Listening</Badge>
                    </div>
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/games/puzzles"
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
                                {data
                                    ? "Arrange words to complete the sentence."
                                    : "Make puzzles from a set of words. Score more points in the given time!"}
                            </p>
                        </div>
                        <Badge size={size}>Grammar</Badge>
                    </div>
                </NavLink>
            </li>
        </ul>
    );
}
