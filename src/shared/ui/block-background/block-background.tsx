import styles from "./block-background.module.scss";
import type { GameType } from "@/entities/user";
import { gamesLabels } from "@/entities/game";
import { Outlet } from "react-router-dom";

export default function BlockBackground({ type }: { type: GameType }) {
    return (
        <div className={styles.container}>
            <div>
                <h1>{gamesLabels[type].title}</h1>
                <p className={styles.container__note}>{gamesLabels[type].description.main}</p>
            </div>
            <div className={styles.container__content}>
                <div className={styles.container__backdrop}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
