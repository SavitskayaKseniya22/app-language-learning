import { InstrumentsList } from "@/widgets/instruments-list";
import { GamesList } from "@/widgets/games-list";
import styles from "./main-page.module.scss";

function MainPage() {
    return (
        <div className={styles.page}>
            <header className={styles.page__header}>
                <h1>
                    Английский.
                    <br />В действии.
                </h1>
                <p>
                    Слушайте. Собирайте слова. Находите перевод.
                    <br />
                    Четыре способа превратить знание в навык.
                </p>
            </header>

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
