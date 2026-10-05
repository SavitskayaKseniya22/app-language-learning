import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import styles from "@/shared/ui/error-component/error.module.scss";
import { Button } from "@/shared/ui/button";

export default class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("Application rendering failed", error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className={styles.error} role="alert">
                    <div className={styles.error__content}>
                        <h1>Не удалось загрузить приложение</h1>
                        <p>Проверьте подключение к интернету и обновите страницу</p>
                        <Button onClick={() => globalThis.location.reload()}>Обновить страницу</Button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
