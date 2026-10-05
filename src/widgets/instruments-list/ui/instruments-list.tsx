import styles from "./instruments.module.scss";
import { NavLink } from "react-router-dom";
import { StyledIcon } from "@/shared/ui/styled-icon";
import clsx from "clsx";
import { useAuth } from "@/features/auth";
import type { SizeType } from "@/shared/types/types";

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
                        <h3>Учебник</h3>

                        <p className={clsx(styles.list__note, styles[`list__note--${size}`])}>
                            Изучайте значения слов в учебнике!
                        </p>

                        <p className={styles.list__details}>
                            3600 самых употребительных английских слов разделены на 6 уровней для последовательного
                            изучения. <br /> Отмечайте слова как «сложные» или «выученные», чтобы отслеживать прогресс!
                        </p>
                    </div>
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/profile"
                    aria-disabled={!user}
                    className={clsx(styles.list__item, { [styles[`list__item--disabled`]]: !user })}>
                    <StyledIcon size={size}>
                        <i className="fa-solid fa-table" />
                    </StyledIcon>
                    <div className={styles.list__description}>
                        <h3>Мой профиль</h3>
                        <p className={clsx(styles.list__note, styles[`list__note--${size}`])}>
                            Следите за прогрессом изучения английского!
                        </p>
                        <p className={styles.list__details}>
                            Выученные слова, статистика и история ваших игр — в одном месте.
                        </p>
                    </div>
                    <p className={styles.list__user}>
                        <span>Доступно после входа в аккаунт</span>
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
                        <h3>Рейтинг игроков</h3>
                        <p className={clsx(styles.list__note, styles[`list__note--${size}`])}>
                            Участвуйте в общем турнире!
                        </p>
                    </div>
                </NavLink>
            </li>
        </ul>
    );
}
