import { DeveloperLink } from "@/shared/ui/developer-link";
import styles from "./footer.module.scss";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div></div>
            <DeveloperLink />
        </footer>
    );
}
