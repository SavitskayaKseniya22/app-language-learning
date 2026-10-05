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
                        <h1>Unable to load the application</h1>
                        <p>Please check your connection and refresh the page.</p>
                        <Button onClick={() => globalThis.location.reload()}>Refresh page</Button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
