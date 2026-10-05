import { NavLink } from "react-router-dom";
import styles from "./sidebar.module.scss";
import clsx from "clsx";
import { handleLogout } from "@/features/auth";
import { useContext } from "react";
import { Auth } from "@/features/auth";
import { ModalContext } from "@/shared/ui/modal";
import { DeveloperLink } from "@/shared/ui/developer-link";
import { useAuth } from "@/features/auth";

export default function Sidebar() {
    const { user } = useAuth();

    const { setContent } = useContext(ModalContext);
    //update modal
    return (
        <nav className={styles.sidebar}>
            <ul className={styles.sidebar__navigation}>
                <li>
                    <NavLink
                        className={({ isActive }) =>
                            clsx(styles.sidebar__link, {
                                [styles["sidebar__link--active"]]: isActive,
                            })
                        }
                        to="/"
                        title="Главная">
                        <i className="fa-solid fa-house" />
                        <span className={styles.sidebar__title}>Главная</span>
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
                        title="Учебник">
                        <i className="fa-solid fa-book-open"></i>
                        <span className={styles.sidebar__title}>Учебник</span>
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
                        title="Игры">
                        <i className="fa-solid fa-puzzle-piece" />
                        <span className={styles.sidebar__title}>Игры</span>
                    </NavLink>
                    <ul className={styles.sidebar__submenu}>
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    clsx(styles.sidebar__link, styles["sidebar__link--sub"], {
                                        [styles["sidebar__link--active"]]: isActive,
                                    })
                                }
                                to="/games/sprint"
                                title="Спринт">
                                <i className="fa-solid fa-stopwatch"></i>
                                <span className={styles.sidebar__title}>Спринт</span>
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
                                title="Конструктор">
                                <i className="fa-solid fa-cubes"></i>
                                <span className={styles.sidebar__title}>Конструктор</span>
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
                                title="Аудиовызов">
                                <i className="fa-solid fa-headphones"></i>
                                <span className={styles.sidebar__title}>Аудиовызов</span>
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
                                title="Пазлы">
                                <i className="fa-solid fa-puzzle-piece"></i>
                                <span className={styles.sidebar__title}>Пазлы</span>
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
                                title="Профиль">
                                <i className="fa-solid fa-user" />
                                <span className={styles.sidebar__title}>Профиль</span>
                            </NavLink>

                            <button
                                type="button"
                                className={clsx(styles.sidebar__link, styles["sidebar__link--button"])}
                                onClick={() => {
                                    void handleLogout();
                                }}>
                                <i className="fa-solid fa-arrow-right-from-bracket" />
                                <span>Выйти</span>
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            className={clsx(styles.sidebar__link, styles["sidebar__link--button"])}
                            onClick={() => {
                                setContent({
                                    body: <Auth />,
                                    title: "Войти",
                                    options: { size: "small" },
                                });
                            }}>
                            <i className="fa-solid fa-user" />
                            <span>Войти</span>
                        </button>
                    )}
                </li>
            </ul>
            <div className={styles.sidebar__credits}>
                <DeveloperLink />
            </div>
        </nav>
    );
}
