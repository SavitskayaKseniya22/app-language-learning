import styles from "./error.module.scss";
import { useRouteError } from "react-router-dom";
import { Button, CustomLinkAsButton } from "../button";

const handleRefresh = () => {
    globalThis.location.reload();
};

export default function ErrorComponent({ error }: { error?: { code: number; message: string } }) {
    const errorFromRoute = useRouteError();

    return (
        <div className={styles.error}>
            <div className={styles.error__content}>
                {error?.code && <p className={styles.error__accent}>{error.code}</p>}

                <h1>{error?.message || "Произошла ошибка"}</h1>

                {!error && errorFromRoute instanceof Error && <p>Не удалось выполнить действие. Попробуйте снова.</p>}

                {error?.code === 404 ? (
                    <CustomLinkAsButton to="/" view="primary">
                        На главную
                    </CustomLinkAsButton>
                ) : (
                    <Button onClick={handleRefresh} view="primary">
                        Обновить страницу
                    </Button>
                )}
            </div>
        </div>
    );
}
