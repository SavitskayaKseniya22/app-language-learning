import styles from "./developer-link.module.scss";

export default function DeveloperLink() {
    return (
        <a
            href="https://github.com/SavitskayaKseniya22"
            target="_blank"
            title="GitHub разработчика"
            rel="noreferrer"
            className={styles.sidelink}>
            <i className="fa-brands fa-github" />
        </a>
    );
}
