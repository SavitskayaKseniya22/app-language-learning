import { InstrumentsList } from "@/widgets/instruments-list";
import { GamesList } from "@/widgets/games-list";
import styles from "./main-page.module.scss";

function MainPage() {
    return (
        <div className={styles.page}>
            <div></div>

            <div className={styles.page__section}>
                <h2>Игры</h2>
                <GamesList size="big" />
            </div>

            <div className={styles.page__section}>
                <h2>Инструменты</h2>
                <InstrumentsList size="small" />
            </div>
        </div>
    );
}

export default MainPage;
