import styles from "./main-page.module.scss";
import { GamesList } from "@/widgets/games-list";
import InstrumentsList from "@/widgets/instruments-list/instruments-list";

function MainPage() {
    return (
        <div className={styles.page}>
            <div className={styles.page__banner}></div>

            <div className={styles.page__section}>
                <h2>Games</h2>
                <GamesList size="big" />
            </div>

            <div className={styles.page__section}>
                <h2>Instruments</h2>
                <InstrumentsList size="small" />
            </div>
        </div>
    );
}

export default MainPage;
