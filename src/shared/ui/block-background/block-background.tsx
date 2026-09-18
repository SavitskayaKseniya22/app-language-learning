import styles from "./block-background.module.scss";
import { Outlet } from "react-router-dom";

export default function BlockBackground({ content }: { content: { title: string; description: string } }) {
    return (
        <div className={styles.container}>
            <div>
                <h1>{content.title}</h1>
                <p className={styles.container__note}>{content.description}</p>
            </div>
            <div className={styles.container__content}>
                <div className={styles.container__backdrop}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
