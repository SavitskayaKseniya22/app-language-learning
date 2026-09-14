import type { GameType } from "@/entities/user";
import styles from "./tips.module.scss";
import { gamesLabels } from "@/entities/game";

export default function Tips({ type }: { type: GameType }) {
    return (
        <ul className={styles.tips}>
            {gamesLabels[type].tips.map(tip => (
                <li key={tip}>{tip}</li>
            ))}
        </ul>
    );
}
