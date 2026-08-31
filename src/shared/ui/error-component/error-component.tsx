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

                <h1>{error?.message || "Something went wrong"}</h1>

                {errorFromRoute instanceof Error && <p>{errorFromRoute.message}</p>}

                {error?.code === 404 ? (
                    <CustomLinkAsButton to="/" view="primary">
                        To dashboard
                    </CustomLinkAsButton>
                ) : (
                    <Button onClick={handleRefresh} view="primary">
                        Refresh page
                    </Button>
                )}
            </div>
        </div>
    );
}
