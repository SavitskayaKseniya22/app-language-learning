import { GamesList } from "@/widgets/games-list";
import styles from "./games.module.scss";

export default function GamesPage() {
    return (
        <div className={styles.page}>
            <div className={styles.page__section}>
                <h2>Игры</h2>
                <GamesList size="big" />
            </div>
        </div>
    );
}
