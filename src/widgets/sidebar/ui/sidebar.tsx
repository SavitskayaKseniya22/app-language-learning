import { NavLink } from "react-router-dom";
import styles from "./sidebar.module.scss";
import { useAuth } from "@/features/auth/model/auth-provider";
import clsx from "clsx";
import handleLogout from "@/features/auth/api/logout";
import { useContext } from "react";
import Auth from "@/features/auth/ui/auth-modal/auth-modal";
import ModalContext from "@/shared/ui/modal/modal-context";
import DeveloperLink from "@/shared/ui/developer-link/developer-link";

export default function Sidebar() {
    const { user } = useAuth();

    const { setContent } = useContext(ModalContext);
    //update modal
    return (
        <div className={styles.sidebar}>
            <ul className={styles.sidebar__navigation}>
                <li>
                    <NavLink
                        className={({ isActive }) =>
                            clsx(styles.sidebar__link, {
                                [styles["sidebar__link--active"]]: isActive,
                            })
                        }
                        to="/"
                        title="Homepage">
                        <i className="fa-solid fa-house" />
                        <span className={styles.sidebar__title}>Homepage</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        className={({ isActive }) =>
                            clsx(styles.sidebar__link, {
                                [styles["sidebar__link--active"]]: isActive,
                            })
                        }
                        to="/text-book"
                        title="Textbook">
                        <i className="fa-solid fa-book" />
                        <span className={styles.sidebar__title}>Textbook</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        className={({ isActive }) =>
                            clsx(styles.sidebar__link, {
                                [styles["sidebar__link--active"]]: isActive,
                            })
                        }
                        to="/games"
                        title="Games">
                        <i className="fa-solid fa-puzzle-piece" />
                        <span className={styles.sidebar__title}>Games</span>
                    </NavLink>
                    <ul className={styles["sidebar__navigation--sub"]}>
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    clsx(styles.sidebar__link, styles["sidebar__link--sub"], {
                                        [styles["sidebar__link--active"]]: isActive,
                                    })
                                }
                                to="/games/sprint"
                                title="Sprint">
                                <i className="fa-solid fa-stopwatch" />
                                <span className={styles.sidebar__title}>Sprint</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    clsx(styles.sidebar__link, styles["sidebar__link--sub"], {
                                        [styles["sidebar__link--active"]]: isActive,
                                    })
                                }
                                to="/games/constructor"
                                title="Constructor">
                                <i className="fa-solid fa-ellipsis" />
                                <span className={styles.sidebar__title}>Constructor</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    clsx(styles.sidebar__link, styles["sidebar__link--sub"], {
                                        [styles["sidebar__link--active"]]: isActive,
                                    })
                                }
                                to="/games/audiocall"
                                title="Audiocall">
                                <i className="fa-solid fa-music" />
                                <span className={styles.sidebar__title}>Audiocall</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    clsx(styles.sidebar__link, styles["sidebar__link--sub"], {
                                        [styles["sidebar__link--active"]]: isActive,
                                    })
                                }
                                to="/games/puzzles"
                                title="Puzzles">
                                <i className="fa-solid fa-puzzle-piece" />
                                <span className={styles.sidebar__title}>Puzzles</span>
                            </NavLink>
                        </li>
                    </ul>
                </li>

                <li>
                    {user ? (
                        <>
                            <NavLink
                                className={({ isActive }) =>
                                    clsx(styles.sidebar__link, {
                                        [styles["sidebar__link--active"]]: isActive,
                                    })
                                }
                                to="/profile"
                                title="Profile">
                                <i className="fa-solid fa-user" />
                                <span className={styles.sidebar__title}>Profile</span>
                            </NavLink>

                            <ul className={styles["sidebar__navigation--sub"]}>
                                <li>
                                    <NavLink
                                        className={({ isActive }) =>
                                            clsx(styles.sidebar__link, styles["sidebar__link--sub"], {
                                                [styles["sidebar__link--active"]]: isActive,
                                            })
                                        }
                                        to="/profile/collection"
                                        title="Collection">
                                        <i className="fa-regular fa-folder" />
                                        <span className={styles.sidebar__title}>Collection</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        className={({ isActive }) =>
                                            clsx(styles.sidebar__link, styles["sidebar__link--sub"], {
                                                [styles["sidebar__link--active"]]: isActive,
                                            })
                                        }
                                        to="/profile/statistics"
                                        title="Statistics">
                                        <i className="fa-solid fa-table" />
                                        <span className={styles.sidebar__title}>Statistics</span>
                                    </NavLink>
                                </li>
                            </ul>
                            <button
                                type="button"
                                className={clsx(styles.sidebar__link, styles["sidebar__link--button"])}
                                onClick={() => {
                                    void handleLogout();
                                }}>
                                <i className="fa-solid fa-arrow-right-from-bracket" />
                                <span>Sign Out</span>
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            className={clsx(styles.sidebar__link, styles["sidebar__link--button"])}
                            onClick={() => {
                                setContent({
                                    body: <Auth />,
                                    title: "Sign in",
                                    options: { size: "small" },
                                });
                            }}>
                            <i className="fa-solid fa-user" />
                            <span>Sign in</span>
                        </button>
                    )}
                </li>
            </ul>
            <div className={styles.sidebar__sidelink}>
                <DeveloperLink />
            </div>
        </div>
    );
}
