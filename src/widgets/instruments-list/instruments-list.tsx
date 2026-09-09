import type { SizeType } from "@/shared/ui/button/button";
import styles from "./instruments.module.scss";
import { NavLink } from "react-router-dom";
import StyledIcon from "@/shared/ui/styled-icon/styled-icon";
import clsx from "clsx";
import { useAuth } from "@/features/auth/model/auth-provider";

export default function InstrumentsList({ size = "medium" }: { size?: SizeType }) {
    const { user } = useAuth();
    return (
        <ul className={styles.list}>
            <li>
                <NavLink to="/text-book" className={styles.list__item}>
                    <StyledIcon size={size}>
                        <i className="fa-solid fa-book-open"></i>
                    </StyledIcon>
                    <div className={styles.list__description}>
                        <h3>Textbook</h3>

                        <p className={clsx(styles.list__note, styles[`list__note--${size}`])}>
                            Use the Textbook to understand the meaning of the word!
                        </p>

                        <p className={styles["list__note--sub"]}>
                            3600 of the most commonly used english words are organised in 6 sections for a convenient
                            and measured learning experience. <br /> Don&apos;t hesitate to mark words as
                            &quot;difficult&quot; or &quot;learned&quot; to better track your progress!
                        </p>
                    </div>
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/profile/collection"
                    aria-disabled={!user}
                    className={clsx(styles.list__item, { [styles[`list__item--disabled`]]: !user })}>
                    <StyledIcon size={size}>
                        <i className="fa-regular fa-folder" />
                    </StyledIcon>
                    <div className={styles.list__description}>
                        <h3>Collection</h3>

                        <p className={clsx(styles.list__note, styles[`list__note--${size}`])}>
                            Collect words into Сollection for practice!
                        </p>

                        <p className={styles["list__note--sub"]}>
                            A set of selected words for individual training in games.
                        </p>
                    </div>
                    <p className={styles.list__user}>
                        <span>Available only for authorized users</span>
                        <i className="fa-solid fa-user"></i>
                    </p>
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/profile/statistics"
                    aria-disabled={!user}
                    className={clsx(styles.list__item, { [styles[`list__item--disabled`]]: !user })}>
                    <StyledIcon size={size}>
                        <i className="fa-solid fa-table" />
                    </StyledIcon>
                    <div className={styles.list__description}>
                        <h3>Statistics</h3>
                        <p className={clsx(styles.list__note, styles[`list__note--${size}`])}>
                            Track your progress in Statistics!
                        </p>
                        <p className={styles["list__note--sub"]}>
                            Your progress is monitored and logged. Be sure to take a look at it once in a while to make
                            sure you are on track!
                        </p>
                    </div>
                    <p className={styles.list__user}>
                        <span>Available only for authorized users</span>
                        <i className="fa-solid fa-user"></i>
                    </p>
                </NavLink>
            </li>
            <li>
                <NavLink to="/leaderboard" className={styles.list__item}>
                    <StyledIcon size={size}>
                        <i className="fa-solid fa-ranking-star"></i>
                    </StyledIcon>
                    <div className={styles.list__description}>
                        <h3>Global leadeboard</h3>
                        <p className={clsx(styles.list__note, styles[`list__note--${size}`])}>
                            Participate in the global tournament!
                        </p>
                    </div>
                </NavLink>
            </li>
        </ul>
    );
}
